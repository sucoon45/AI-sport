import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { initializeTransaction } from '@/utils/paystack';

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { amount } = await req.json();
        const user = await User.findOne({ email: 'operator@matrix.net' });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 1. Initialize Paystack Transaction
        const paystackData = await initializeTransaction(user.email, amount);

        return NextResponse.json({
            success: true,
            authorization_url: paystackData.data.authorization_url,
            reference: paystackData.data.reference
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
