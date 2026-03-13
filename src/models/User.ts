import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password?: string;
    balanceNaira: number;
    balanceCrypto: number;
    walletAddress?: string;
    linkedAccounts: Array<{
        provider: 'SportyBet' | 'Bet9ja' | 'Football.com';
        username: string;
        connected: boolean;
    }>;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    balanceNaira: { type: Number, default: 0 },
    balanceCrypto: { type: Number, default: 0 },
    walletAddress: { type: String },
    linkedAccounts: [{
        provider: { type: String, enum: ['SportyBet', 'Bet9ja', 'Football.com'] },
        username: { type: String },
        connected: { type: Boolean, default: false }
    }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
