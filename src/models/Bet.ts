import mongoose, { Schema, Document } from 'mongoose';

export interface IBet extends Document {
    matchText: string;
    type: string;
    odds: number;
    stake: number;
    currency: 'NGN' | 'ETH';
    result: 'PENDING' | 'WON' | 'LOST';
    payout: number;
    date: Date;
    userWallet?: string;
    userId: mongoose.Types.ObjectId;
}

const BetSchema: Schema = new Schema({
    matchText: { type: String, required: true },
    type: { type: String, required: true },
    odds: { type: Number, required: true },
    stake: { type: Number, required: true },
    currency: { type: String, enum: ['NGN', 'ETH'], default: 'NGN' },
    result: { type: String, enum: ['PENDING', 'WON', 'LOST'], default: 'PENDING' },
    payout: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    userWallet: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models.Bet || mongoose.model<IBet>('Bet', BetSchema);
