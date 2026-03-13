import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const getUserId = (req: NextRequest): string | null => {
    const token = req.cookies.get('sportai_auth_token')?.value;
    if (!token) return null;
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    } catch { return null; }
};

// GET — Fetch notifications for current user (user-specific + broadcasts)
export async function GET(req: NextRequest) {
    await dbConnect();
    const userId = getUserId(req);

    // Build query: user-specific OR broadcast (userId = null)
    const query = userId
        ? { $or: [{ userId }, { userId: null }] }
        : { userId: null };

    const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(30);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return NextResponse.json({ notifications, unreadCount });
}

// PATCH — Mark notification(s) as read
export async function PATCH(req: NextRequest) {
    await dbConnect();
    const userId = getUserId(req);
    const { id, markAll } = await req.json();

    if (markAll) {
        const q = userId ? { $or: [{ userId }, { userId: null }] } : { userId: null };
        await Notification.updateMany(q, { $set: { isRead: true } });
        return NextResponse.json({ success: true, message: 'All notifications marked as read.' });
    }

    if (id) {
        await Notification.findByIdAndUpdate(id, { $set: { isRead: true } });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Provide id or markAll=true' }, { status: 400 });
}

// POST — Admin: Create a broadcast or targeted notification
export async function POST(req: NextRequest) {
    await dbConnect();
    const { title, body, type, link, targetUserId } = await req.json();

    if (!title || !body) {
        return NextResponse.json({ error: 'title and body required' }, { status: 400 });
    }

    const notification = await Notification.create({
        userId: targetUserId || null,
        title,
        body,
        type: type || 'SYSTEM',
        link: link || null,
    });

    return NextResponse.json({ success: true, notification });
}
