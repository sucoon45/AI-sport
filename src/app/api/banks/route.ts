import { NextResponse } from 'next/server';
import { getBanks } from '@/utils/paystack';

export async function GET() {
    try {
        const data = await getBanks();
        // Paystack returns an array of banks in data.data
        return NextResponse.json(data.data || []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
