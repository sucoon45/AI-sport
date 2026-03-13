import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Fixture from '@/models/Fixture';
import { getLiveMatches, getHistoricalMatches } from '@/utils/footballApi';
import { trainModelAndPredict, getPredictionLabel } from '@/utils/aiModel';

export async function GET() {
    await dbConnect();
    try {
        console.log("🔄 Starting Real-Time Signal Synchronization...");
        const liveMatches = await getLiveMatches();
        const historicalData = await getHistoricalMatches();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const updatedFixtures = await Promise.all(liveMatches.map(async (liveMatch: any) => {
            // Find existing fixture or create new one
            // We search for matches today involving these teams
            const home = liveMatch.home_team;
            const away = liveMatch.away_team;
            
            let fixture = await Fixture.findOne({
                homeTeam: home,
                awayTeam: away,
                eventDate: { $gte: today }
            });

            const liveStatus = liveMatch.status || 'LIVE';
            const liveScore = liveMatch.score || { home: 0, away: 0 };

            if (!fixture) {
                // Create new live fixture if it doesn't exist
                const features = {
                    home_goals: liveScore.home || 1.2,
                    away_goals: liveScore.away || 0.8,
                    home_form: 0.6,
                    away_form: 0.6,
                    odds_home: 2.0,
                    odds_draw: 3.2,
                    odds_away: 3.5
                };

                const aiResult = trainModelAndPredict(historicalData, features);
                
                fixture = await Fixture.create({
                    fixtureId: `live-${home}-${away}-${Date.now()}`,
                    homeTeam: home,
                    awayTeam: away,
                    league: liveMatch.league || 'International',
                    startTime: 'LIVE',
                    prediction: {
                        type: getPredictionLabel(aiResult.prediction),
                        probability: parseFloat(aiResult.confidence.toFixed(2)),
                        odds: 2.1,
                        overUnder: aiResult.overUnder,
                        signal: aiResult.signal
                    },
                    eventDate: new Date(),
                    status: liveStatus,
                    liveScore: liveScore,
                    isLive: true
                });
            } else {
                // Update existing fixture status and score
                fixture.status = liveStatus;
                fixture.liveScore = liveScore;
                fixture.isLive = true;
                
                // Re-run AI if status changed significantly or just periodically
                // For "Real-Time" feel, we update the prediction based on the new live score state
                const features = {
                    home_goals: liveScore.home,
                    away_goals: liveScore.away,
                    home_form: 0.6,
                    away_form: 0.6,
                    odds_home: fixture.prediction.odds // Use existing odds or update
                };
                const aiResult = trainModelAndPredict(historicalData, features);
                fixture.prediction.type = getPredictionLabel(aiResult.prediction);
                fixture.prediction.probability = parseFloat(aiResult.confidence.toFixed(2));
                fixture.prediction.signal = aiResult.signal;

                await fixture.save();
            }
            return fixture;
        }));

        return NextResponse.json({
            success: true,
            syncCount: updatedFixtures.length,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("❌ Sync Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
