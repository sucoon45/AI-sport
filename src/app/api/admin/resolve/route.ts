import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bet from '@/models/Bet';
import Stats from '@/models/Stats';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const getUserId = (req: NextRequest) => {
    const token = req.cookies.get('sportai_auth_token')?.value;
    if (!token) return null;
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    } catch (e) {
        return null;
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const pendingBets = await Bet.find({ userId, result: 'PENDING' });
        
        if (pendingBets.length === 0) {
            return NextResponse.json({ message: 'No pending executions to resolve.' });
        }

        const stats = await Stats.findOne();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let resolvedCount = 0;
        let wonCount = 0;
        let totalProfitNGN = 0;
        let totalProfitCrypto = 0;

        for (const bet of pendingBets) {
            // Simulation logic: 60% win rate if the signal was "Strong Buy", 40% otherwise
            const winChance = bet.type.toLowerCase().includes('strong') ? 0.65 : 0.45;
            const didWin = Math.random() < winChance;

            if (didWin) {
                bet.result = 'WON';
                bet.payout = bet.stake * bet.odds;
                wonCount++;
                
                // Refund stake + profit to user balance
                if (bet.currency === 'NGN') {
                    user.balanceNaira += bet.payout;
                    totalProfitNGN += (bet.payout - bet.stake);
                } else {
                    user.balanceCrypto += bet.payout;
                    totalProfitCrypto += (bet.payout - bet.stake);
                }
            } else {
                bet.result = 'LOST';
                bet.payout = 0;
            }

            await bet.save();
            resolvedCount++;
        }

        // Update stats (Global stats for now or we could have per-user stats)
        if (stats) {
            const nominalProfit = totalProfitNGN / 1500 + totalProfitCrypto * 3500; 
            stats.totalProfit += nominalProfit;
            stats.pendingBets = Math.max(0, stats.pendingBets - resolvedCount);
            
            // Calculate accuracy globally
            const allResolved = await Bet.countDocuments({ result: { $ne: 'PENDING' } });
            const allWon = await Bet.countDocuments({ result: 'WON' });
            stats.predictionAccuracy = allResolved > 0 ? Math.round((allWon / allResolved) * 100) : 100;

            // Add to profit history
            stats.profitHistory.push({
                name: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                profit: stats.totalProfit
            });
            if (stats.profitHistory.length > 20) stats.profitHistory.shift();

            await stats.save();
        }

        await user.save();

        return NextResponse.json({
            success: true,
            resolved: resolvedCount,
            won: wonCount,
            profitNGN: totalProfitNGN,
            profitCrypto: totalProfitCrypto
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
