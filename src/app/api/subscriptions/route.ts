import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { initializeTransaction } from '@/utils/paystack';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const getUserId = (req: NextRequest) => {
    const token = req.cookies.get('sportai_auth_token')?.value;
    if (!token) return null;
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    } catch (e) { return null; }
};

// Subscription Plan Definitions
const PLANS: Record<string, { amount: number; label: string; daysValid: number }> = {
    VIP:     { amount: 2500,  label: 'VIP Daily',     daysValid: 1   },
    MONTHLY: { amount: 15000, label: 'Monthly Premium', daysValid: 30  },
};

// GET: Fetch current user subscription status
export async function GET(req: NextRequest) {
    await dbConnect();
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await User.findById(userId).select('email tier subscriptionExpiry');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const isActive =
        user.tier !== 'FREE' &&
        user.subscriptionExpiry &&
        new Date(user.subscriptionExpiry) > new Date();

    return NextResponse.json({
        tier: user.tier,
        subscriptionExpiry: user.subscriptionExpiry,
        isActive,
        email: user.email,
    });
}

// POST: Initiate a Paystack payment to upgrade subscription
export async function POST(req: NextRequest) {
    await dbConnect();
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { plan } = await req.json();
    const selectedPlan = PLANS[plan?.toUpperCase()];
    if (!selectedPlan) {
        return NextResponse.json({ error: 'Invalid plan. Choose VIP or MONTHLY.' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    try {
        const paystackRes = await initializeTransaction(user.email, selectedPlan.amount);
        if (!paystackRes?.data?.authorization_url) {
            return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 });
        }

        return NextResponse.json({
            authorizationUrl: paystackRes.data.authorization_url,
            reference: paystackRes.data.reference,
            plan: selectedPlan.label,
            amount: selectedPlan.amount,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
