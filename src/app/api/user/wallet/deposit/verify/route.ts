import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyTransaction } from '@/utils/paystack';

export async function GET(req: Request) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
        return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }

    try {
        // 1. Verify with Paystack
        const verification = await verifyTransaction(reference);

        if (verification.data.status === 'success') {
            const amountInNaira = verification.data.amount / 100;
            const userEmail = verification.data.customer.email;

            // 2. Update User Balance
            const user = await User.findOneAndUpdate(
                { email: userEmail },
                { $inc: { balanceNaira: amountInNaira } },
                { new: true }
            );

            return NextResponse.json({
                success: true,
                newBalance: user.balanceNaira,
                message: 'Vault replenished successfully.'
            });
        } else {
            return NextResponse.json({ error: 'Transaction not successful' }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
