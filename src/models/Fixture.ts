import mongoose, { Schema, Document } from 'mongoose';

export interface IFixture extends Document {
    fixtureId: string;
    homeTeam: string;
    awayTeam: string;
    league: string;
    startTime: string;
    prediction: {
        type: string;
        probability: number;
        odds: number;
        overUnder?: string;
        signal?: string;
    };
    eventDate: Date;
    status: string;
    liveScore?: {
        home: number;
        away: number;
    };
    isLive: boolean;
    isVIP: boolean;
}

const FixtureSchema: Schema = new Schema({
    fixtureId: { type: String, required: true, unique: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    league: { type: String, required: true },
    startTime: { type: String, required: true },
    prediction: {
        type: { type: String, required: true },
        probability: { type: Number, required: true },
        odds: { type: Number, required: true },
        overUnder: { type: String },
        signal: { type: String },
    },
    eventDate: { type: Date, required: true },
    status: { type: String, default: 'NS' },
    liveScore: {
        home: { type: Number, default: 0 },
        away: { type: Number, default: 0 }
    },
    isLive: { type: Boolean, default: false },
    isVIP: { type: Boolean, default: false }
});

export default mongoose.models.Fixture || mongoose.model<IFixture>('Fixture', FixtureSchema);
