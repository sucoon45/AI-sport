import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Fixture from '@/models/Fixture';
import Stats from '@/models/Stats';
import { getCombinedMatchData, getHistoricalMatches } from '@/utils/footballApi';
import { trainModelAndPredict, getPredictionLabel } from '@/utils/aiModel';

export async function GET() {
    await dbConnect();
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Try to fetch from DB first (Seeded or Cached)
        const cachedFixtures = await Fixture.find({
            eventDate: { $gte: today }
        }).sort({ eventDate: 1 }).limit(20);

        // 2. If we have at least some data, return it immediately for instant UI response
        if (cachedFixtures.length > 0) {
            console.log(`📦 Serving ${cachedFixtures.length} cached fixtures from Matrix DB...`);
            return NextResponse.json(cachedFixtures);
        }

        // 3. Fallback: Synchronize with Real-Time Data (Bzzoiro + Odds API)
        console.log("📡 DB Empty. Compiling data from Bzzoiro and Odds API...");
        
        const combinedData = await getCombinedMatchData();
        const historicalData = await getHistoricalMatches();
        
        if (!combinedData || combinedData.length === 0) {
            return NextResponse.json([]);
        }

        // Process a smaller batch to avoid DB timeouts on first boot
        const batch = combinedData.slice(0, 10);
        
        const transformed = await Promise.all(batch.map(async (matchItem: any) => {
            // Check existence again using a derived ID or something generic since Bzzoiro IDs might vary.
            // Using home + away team string as unique identifier for the day.
            const uniqueId = `${matchItem.home_team}-${matchItem.away_team}-${today.getTime()}`;
            const existing = await Fixture.findOne({ fixtureId: uniqueId });
            if (existing) return existing;

            // Extract features safely
            const features = {
                home_goals: matchItem.stats?.home_goals || 1.2,
                away_goals: matchItem.stats?.away_goals || 0.8,
                home_form: matchItem.stats?.home_form || 0.5,
                away_form: matchItem.stats?.away_form || 0.5,
                odds_home: matchItem.odds?.odds_home || 2.0,
                odds_draw: matchItem.odds?.odds_draw || 3.0,
                odds_away: matchItem.odds?.odds_away || 3.0
            };

            // 4. Run the AI Classification Model
            const aiResult = trainModelAndPredict(historicalData, features);
            let finalType = 'Home Win';
            let finalProb = 0.5;
            let finalOdds = features.odds_home;
            let finalOverUnder = 'Over 2.5';
            let finalSignal = 'Value Bet';

            if (aiResult) {
                finalType = getPredictionLabel(aiResult.prediction);
                finalProb = aiResult.confidence;
                finalOverUnder = aiResult.overUnder;
                finalSignal = aiResult.signal;
                
                if (aiResult.prediction === 0) finalOdds = features.odds_away;
                else if (aiResult.prediction === 1) finalOdds = features.odds_draw;
                else finalOdds = features.odds_home;
            }

            const newFixture = {
                fixtureId: uniqueId,
                homeTeam: matchItem.home_team || 'Unknown Home',
                awayTeam: matchItem.away_team || 'Unknown Away',
                // fallback league name
                league: matchItem.stats?.league?.name || 'International League',
                // mock startTime or parse if it exist
                startTime: matchItem.stats?.date ? new Date(matchItem.stats.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '15:00',
                prediction: {
                    type: finalType,
                    probability: parseFloat(finalProb.toFixed(2)),
                    odds: parseFloat(finalOdds.toFixed(2)),
                    overUnder: finalOverUnder,
                    signal: finalSignal,
                },
                eventDate: matchItem.stats?.date ? new Date(matchItem.stats.date) : new Date(),
            };

            return await Fixture.create(newFixture);
        }));

        return NextResponse.json(transformed);
    } catch (error: any) {
        console.error("❌ Matrix Sync Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
