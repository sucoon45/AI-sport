import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { createTransferRecipient, initiateTransfer } from '@/utils/paystack';

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { amount, bankCode, accountNumber, accountName } = await req.json();
        
        const user = await User.findOne({ email: 'operator@matrix.net' });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        if (user.balanceNaira < amount) {
            return NextResponse.json({ error: 'Insufficient liquidity in Primary Vault.' }, { status: 400 });
        }

        // 1. Create Transfer Recipient
        const recipientData = await createTransferRecipient(accountName, accountNumber, bankCode);
        const recipientCode = recipientData.data.recipient_code;

        // 2. Initiate Transfer
        const transferResult = await initiateTransfer(amount, recipientCode);

        if (transferResult.status) {
            // 3. Deduct from balance
            user.balanceNaira -= amount;
            await user.save();

            return NextResponse.json({
                success: true,
                message: 'Withdrawal protocol initiated. Funds are in transit.',
                newBalance: user.balanceNaira
            });
        } else {
            return NextResponse.json({ error: 'Withdrawal failed' }, { status: 400 });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
