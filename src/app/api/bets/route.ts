import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Bet from '@/models/Bet';
import Stats from '@/models/Stats';
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

        const { matchText, type, odds, stake, currency } = await req.json();
        const activeCurrency = currency || 'NGN';

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check funds
        if (activeCurrency === 'NGN') {
            if (user.balanceNaira < stake) {
                return NextResponse.json({ error: 'Insufficient Naira liquidity in Primary Vault.' }, { status: 400 });
            }
            user.balanceNaira -= stake;
        } else {
            if (user.balanceCrypto < stake) {
                return NextResponse.json({ error: 'Insufficient Crypto assets in Digital Vault.' }, { status: 400 });
            }
            user.balanceCrypto -= stake;
        }

        await user.save();

        // Register the bet in our system
        const newBet = await Bet.create({
            userId,
            matchText,
            type,
            odds,
            stake,
            currency: activeCurrency,
            result: 'PENDING',
            payout: 0,
            date: new Date()
        });

        // Update Stats (Global stats for all users for now, or per user if preferred)
        const stats = await Stats.findOne();
        if (stats) {
            stats.pendingBets += 1;
            await stats.save();
        }

        return NextResponse.json({ success: true, bet: newBet, remainingBalance: activeCurrency === 'NGN' ? user.balanceNaira : user.balanceCrypto });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const bets = await Bet.find({ userId }).sort({ date: -1 });
        return NextResponse.json(bets);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
