import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.join(__dirname, '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sportgame';

async function clearAll() {
    try {
        console.log('🚀 Connecting to Matrix DB...');
        await mongoose.connect(MONGODB_URI);
        
        // Define schemas just to clear them
        const Fixture = mongoose.models.Fixture || mongoose.model('Fixture', new mongoose.Schema({}));
        const Bet = mongoose.models.Bet || mongoose.model('Bet', new mongoose.Schema({}));
        const Stats = mongoose.models.Stats || mongoose.model('Stats', new mongoose.Schema({}));
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
            email: String,
            balanceNaira: Number,
            balanceCrypto: Number,
            linkedAccounts: Array
        }));

        console.log('🧹 Clearing Fixtures...');
        await Fixture.deleteMany({});
        
        console.log('🧹 Clearing Bets...');
        await Bet.deleteMany({});
        
        console.log('🧹 Resetting Stats...');
        await Stats.deleteMany({});
        await Stats.create({
            totalProfit: 0,
            predictionAccuracy: 0,
            activeBots: 0,
            pendingBets: 0,
            profitHistory: []
        });

        console.log('🧹 Resetting Operator User...');
        const user = await User.findOne({ email: 'operator@matrix.net' });
        if (user) {
            user.balanceNaira = 0;
            user.balanceCrypto = 0;
            user.linkedAccounts = [];
            await user.save();
        }

        console.log('✅ Matrix Database Purged & Reset to Real-Time Mode.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Reset Error:', err);
        process.exit(1);
    }
}

clearAll();
