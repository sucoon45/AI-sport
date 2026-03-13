import mongoose, { Schema, Document } from 'mongoose';

export interface IStats extends Document {
    totalProfit: number;
    predictionAccuracy: number;
    activeBots: number;
    pendingBets: number;
    profitHistory: Array<{
        name: string;
        profit: number;
    }>;
    updatedAt: Date;
}

const StatsSchema: Schema = new Schema({
    totalProfit: { type: Number, default: 0 },
    predictionAccuracy: { type: Number, default: 0 },
    activeBots: { type: Number, default: 0 },
    pendingBets: { type: Number, default: 0 },
    profitHistory: [{
        name: { type: String, required: true },
        profit: { type: Number, required: true },
    }],
}, { timestamps: true });

export default mongoose.models.Stats || mongoose.model<IStats>('Stats', StatsSchema);
