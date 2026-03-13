import dbConnect from './mongodb';
import Stats from '../models/Stats';
import Fixture from '../models/Fixture';

const seedData = async () => {
    try {
        await dbConnect();
        console.log('📡 Connected to Matrix Database...');

        // Clear existing data (optional, but good for a fresh start)
        await Stats.deleteMany({});
        await Fixture.deleteMany({});

        // 1. Seed Stats
        await Stats.create({
            totalProfit: 4280.45,
            predictionAccuracy: 78,
            activeBots: 12,
            pendingBets: 8,
            profitHistory: [
                { name: 'Mon', profit: 4000 },
                { name: 'Tue', profit: 3000 },
                { name: 'Wed', profit: 5000 },
                { name: 'Thu', profit: 4500 },
                { name: 'Fri', profit: 6000 },
                { name: 'Sat', profit: 5500 },
                { name: 'Sun', profit: 7000 },
            ]
        });
        console.log('✅ Stats Matrix Initialized');

        // 2. Seed some Dummy Fixtures (if API is not available or for testing)
        const dummyFixtures = [
            {
                fixtureId: 1001,
                homeTeam: 'Arsenal',
                awayTeam: 'Liverpool',
                league: 'Premier League',
                startTime: '20:00',
                eventDate: new Date(),
                prediction: {
                    type: 'Home Win',
                    probability: 0.72,
                    odds: 1.85
                }
            },
            {
                fixtureId: 1002,
                homeTeam: 'Real Madrid',
                awayTeam: 'Barcelona',
                league: 'La Liga',
                startTime: '21:00',
                eventDate: new Date(),
                prediction: {
                    type: 'Over 2.5',
                    probability: 0.85,
                    odds: 1.62
                }
            }
        ];

        await Fixture.insertMany(dummyFixtures);
        console.log('✅ Baseline Fixtures Injected');

        console.log('🚀 Seeding Protocol Complete.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Protocol Failed:', error);
        process.exit(1);
    }
};

seedData();
