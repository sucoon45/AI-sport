import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { action, email, password } = await req.json();

        if (action === 'login') {
            const user = await User.findOne({ email });
            if (!user) {
                return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
            }

            // Check if user has a password (might be a mock user without a password)
            if (!user.password && password) {
                // If the user exists but has no password set (old mock data), let's set it now for this first login
                user.password = await bcrypt.hash(password, 10);
                await user.save();
            } else if (user.password) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
                }
            }

            const token = jwt.sign(
                { userId: user._id, email: user.email },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            const response = NextResponse.json({ success: true, message: 'Authenticated', user: { email: user.email } });
            response.cookies.set({
                name: 'sportai_auth_token',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });
            return response;
        }

        if (action === 'register') {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                email,
                password: hashedPassword,
                balanceNaira: 0,
                balanceCrypto: 0,
                linkedAccounts: []
            });

            const token = jwt.sign(
                { userId: newUser._id, email: newUser.email },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            const response = NextResponse.json({ success: true, message: 'User created', user: { email: newUser.email } });
            response.cookies.set({
                name: 'sportai_auth_token',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });
            return response;
        }

        if (action === 'logout') {
            const response = NextResponse.json({ success: true, message: 'Logged out' });
            response.cookies.delete('sportai_auth_token');
            return response;
        }

        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error('Auth error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
    }
}
