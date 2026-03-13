import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Stats from '@/models/Stats';

export async function GET() {
    await dbConnect();
    try {
        let stats = await Stats.findOne();
        if (!stats) {
            // Default initial stats (Clearing out mock data)
            stats = await Stats.create({
                totalProfit: 0,
                predictionAccuracy: 0,
                activeBots: 0,
                pendingBets: 0,
                profitHistory: []
            });
        }
        return NextResponse.json(stats);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();
    try {
        const data = await req.json();
        let stats = await Stats.findOne();
        if (stats) {
            Object.assign(stats, data);
            await stats.save();
        } else {
            stats = await Stats.create(data);
        }
        return NextResponse.json(stats);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
