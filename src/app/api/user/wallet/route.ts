import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const getUserId = (req: NextRequest) => {
    const token = req.cookies.get('sportai_auth_token')?.value;
    if (!token) return null;
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    } catch (e) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { action, amount, currency } = await req.json();
        const user = await User.findById(userId);

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        if (action === 'deposit') {
            if (currency === 'NGN') user.balanceNaira += amount;
            else user.balanceCrypto += amount;
        } else if (action === 'withdraw') {
            if (currency === 'NGN') {
                if (user.balanceNaira < amount) return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
                user.balanceNaira -= amount;
            } else {
                if (user.balanceCrypto < amount) return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
                user.balanceCrypto -= amount;
            }
        }

        await user.save();
        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
