import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyTransaction } from '@/utils/paystack';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const PLAN_DAYS: Record<string, { tier: 'VIP' | 'MONTHLY'; days: number }> = {
    VIP:     { tier: 'VIP',     days: 1  },
    MONTHLY: { tier: 'MONTHLY', days: 30 },
};

export async function GET(req: NextRequest) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');
    const plan = (searchParams.get('plan') || 'VIP').toUpperCase();

    if (!reference) {
        return NextResponse.redirect(new URL('/wallet?error=missing_ref', req.url));
    }

    try {
        const verification = await verifyTransaction(reference);

        if (!verification?.data || verification.data.status !== 'success') {
            return NextResponse.redirect(new URL('/wallet?error=payment_failed', req.url));
        }

        // Get user from JWT cookie
        const token = req.cookies.get('sportai_auth_token')?.value;
        let userId: string | null = null;
        if (token) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decoded: any = jwt.verify(token, JWT_SECRET);
            userId = decoded.userId;
        }

        // If no cookie, try to find user by email on the Paystack response
        const payerEmail = verification.data.customer?.email;
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ email: payerEmail });

        if (!user) {
            return NextResponse.redirect(new URL('/wallet?error=user_not_found', req.url));
        }

        const selectedPlan = PLAN_DAYS[plan] || PLAN_DAYS['VIP'];
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + selectedPlan.days);

        user.tier = selectedPlan.tier;
        user.subscriptionExpiry = expiry;
        await user.save();

        return NextResponse.redirect(new URL('/predictions?upgraded=1', req.url));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error('Subscription callback error:', err.message);
        return NextResponse.redirect(new URL('/wallet?error=server_error', req.url));
    }
}
