import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    userId?: string;         // null = broadcast to all
    title: string;
    body: string;
    type: 'SIGNAL' | 'VIP' | 'RESULT' | 'SYSTEM' | 'PROMO';
    isRead: boolean;
    link?: string;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
    userId:    { type: Schema.Types.ObjectId, ref: 'User', default: null },
    title:     { type: String, required: true },
    body:      { type: String, required: true },
    type:      { type: String, enum: ['SIGNAL', 'VIP', 'RESULT', 'SYSTEM', 'PROMO'], default: 'SYSTEM' },
    isRead:    { type: Boolean, default: false },
    link:      { type: String, default: null },
}, { timestamps: true });

NotificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Notification ||
    mongoose.model<INotification>('Notification', NotificationSchema);
