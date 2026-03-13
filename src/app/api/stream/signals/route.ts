import { NextRequest } from 'next/request';
import dbConnect from '@/lib/mongodb';
import Fixture from '@/models/Fixture';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    await dbConnect();

    const sendUpdate = async () => {
        try {
            const liveFixtures = await Fixture.find({ isLive: true }).limit(5);
            const data = JSON.stringify(liveFixtures);
            await writer.write(encoder.encode(`data: ${data}\n\n`));
        } catch (e) {
            console.error('SSE Error:', e);
        }
    };

    // Initial send
    sendUpdate();

    // Set up interval to send updates every 10 seconds
    const interval = setInterval(sendUpdate, 10000);

    // Keep connection alive
    // Handle closure
    const response = new Response(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        },
    });

    // Cleanup on close
    req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        writer.close();
    });

    return response;
}
