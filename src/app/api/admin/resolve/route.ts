import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bet from '@/models/Bet';
import Stats from '@/models/Stats';
import User from '@/models/User';

export async function POST(req: Request) {
    await dbConnect();
    try {
        const pendingBets = await Bet.find({ result: 'PENDING' });
        
        if (pendingBets.length === 0) {
            return NextResponse.json({ message: 'No pending executions to resolve.' });
        }

        const stats = await Stats.findOne();
        const user = await User.findOne({ email: 'operator@matrix.net' });

        let resolvedCount = 0;
        let wonCount = 0;
        let totalProfitNGN = 0;
        let totalProfitCrypto = 0;

        for (const bet of pendingBets) {
            // Simulation logic: 60% win rate if the signal was "Strong Buy", 40% otherwise
            const winChance = bet.type === 'Strong Buy' ? 0.65 : 0.45;
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

        // Update stats
        if (stats) {
            const oldTotalProfit = stats.totalProfit;
            // For simplicity, we convert crypto profit to a nominal dollar value for the dashboard stats
            const nominalProfit = totalProfitNGN / 1500 + totalProfitCrypto * 3500; 
            stats.totalProfit += nominalProfit;
            stats.pendingBets = Math.max(0, stats.pendingBets - resolvedCount);
            
            // Calculate accuracy
            const allResolved = await Bet.countDocuments({ result: { $ne: 'PENDING' } });
            const allWon = await Bet.countDocuments({ result: 'WON' });
            stats.predictionAccuracy = allResolved > 0 ? Math.round((allWon / allResolved) * 100) : 100;

            // Add to profit history
            stats.profitHistory.push({
                name: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                profit: stats.totalProfit
            });
            // Keep history limited
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
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
