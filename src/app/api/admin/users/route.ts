import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const getAdminUser = async (req: NextRequest) => {
    const token = req.cookies.get('sportai_auth_token')?.value;
    if (!token) return null;
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch { return null; }
};

// GET /api/admin/users — list all users
export async function GET(req: NextRequest) {
    await dbConnect();
    const admin = await getAdminUser(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    const skip = (page - 1) * limit;

    const users = await User.find({})
        .select('email tier subscriptionExpiry balanceNaira createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await User.countDocuments();

    return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) });
}

// PATCH /api/admin/users — promote or reset a user's tier
export async function PATCH(req: NextRequest) {
    await dbConnect();
    const admin = await getAdminUser(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { userId, action, tier, days, amount, currency } = await req.json();

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (action === 'setTier') {
        user.tier = tier;
        if (tier !== 'FREE' && days) {
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + parseInt(days));
            user.subscriptionExpiry = expiry;
        } else if (tier === 'FREE') {
            user.subscriptionExpiry = undefined;
        }
        await user.save();
        return NextResponse.json({ success: true, message: `User promoted to ${tier}` });
    }

    if (action === 'adjustBalance') {
        if (currency === 'NGN') user.balanceNaira += amount;
        else user.balanceCrypto += amount;
        await user.save();
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
