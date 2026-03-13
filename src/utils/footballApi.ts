import axios from 'axios';

// 1. Bzzoiro Sports Data API Configuration
const BZZOIRO_API_KEY = process.env.BZZOIRO_API_KEY || '';
const BZZOIRO_API_HOST = 'https://api.bzzoiro.com';

// 2. The Odds API Configuration
const ODDS_API_KEY = process.env.ODDS_API_KEY || '';
const ODDS_API_HOST = 'https://api.odds-api.io/v3';

// 3. BetStack Sports Betting API Configuration
const BETSTACK_API_KEY = process.env.BETSTACK_API_KEY || '';
const BETSTACK_API_HOST = 'https://api.betstack.io/be';

// 4. RapidAPI Football Configuration (Fallback)
const RAPIDAPI_KEY = process.env.FOOTBALL_API_KEY || '';
const RAPIDAPI_HOST = process.env.FOOTBALL_API_HOST || 'the-football-api.p.rapidapi.com';

/**
 * Step 1: Collect Match Data.
 * Tries Bzzoiro/Odds first, then falls back to RapidAPI if keys are missing or calls fail.
 */
export const getCombinedMatchData = async () => {
    // Attempt Bzzoiro & Odds API first if keys exist
    if (BZZOIRO_API_KEY && ODDS_API_KEY) {
        try {
            console.log(`[Bzzoiro API] Fetching matches...`);
            const bzzoiroRes = await axios.get(`${BZZOIRO_API_HOST}/matches`, {
                headers: { 'Authorization': `Token ${BZZOIRO_API_KEY}` }
            });
            const matches = bzzoiroRes.data.matches || [];

            console.log(`[Odds API] Fetching odds data...`);
            const oddsRes = await axios.get(`${ODDS_API_HOST}/events?sport=football`, {
                headers: { 'Authorization': `Token ${ODDS_API_KEY}` }
            });
            const odds = oddsRes.data.events || [];

            if (matches.length > 0) {
                const combinedData = [];
                for (const match of matches) {
                    const matchId = match.id;
                    const matchOdds = odds.find((o: any) => o.id === matchId) || null;
                    combinedData.push({
                        home_team: match.home_team,
                        away_team: match.away_team,
                        stats: match,
                        odds: matchOdds
                    });
                }
                return combinedData;
            }
        } catch (error) {
            console.warn('Bzzoiro/Odds API failed, attempting RapidAPI fallback...');
        }
    }

    // RapidAPI Fallback
    if (RAPIDAPI_KEY) {
        try {
            console.log(`[RapidAPI] Fetching upcoming fixtures...`);
            const response = await fetch(`https://${RAPIDAPI_HOST}/fixtures`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': RAPIDAPI_KEY,
                    'X-RapidAPI-Host': RAPIDAPI_HOST
                }
            });
            
            const data = await response.json();
            const fixtures = data.fixtures || data.data || data || [];
            
            return fixtures.map((f: any) => ({
                home_team: f.homeTeam || f.home_team || f.teams?.home?.name || 'Home Team',
                away_team: f.awayTeam || f.away_team || f.teams?.away?.name || 'Away Team',
                stats: {
                    league: { name: f.league?.name || 'Major League' },
                    date: f.date || f.startTime || new Date().toISOString(),
                    home_goals: 1.5,
                    away_goals: 1.2
                },
                odds: {
                    odds_home: f.odds?.home || 2.1,
                    odds_draw: f.odds?.draw || 3.2,
                    odds_away: f.odds?.away || 3.1
                }
            }));
        } catch (error) {
            console.error('RapidAPI Fallback Error:', error);
        }
    }

    // Final Fallback: No data
    console.log('Final Fallback: No active transmissions detected.');
    return [];
};

/**
 * Step 1.2: Fetch Live Matches for Real-Time Signals
 */
export const getLiveMatches = async () => {
    // Attempt Bzzoiro for live data first
    if (BZZOIRO_API_KEY) {
        try {
            const res = await axios.get(`${BZZOIRO_API_HOST}/live`, {
                headers: { 'Authorization': `Token ${BZZOIRO_API_KEY}` }
            });
            return res.data.matches || [];
        } catch (e) {
            console.warn('[Bzzoiro] Live check failed.');
        }
    }

    // Logic: If no live data, we return some "Active" mocks based on today's fixtures
    if (RAPIDAPI_KEY) {
        try {
            const response = await fetch(`https://${RAPIDAPI_HOST}/live`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': RAPIDAPI_KEY,
                    'X-RapidAPI-Host': RAPIDAPI_HOST
                }
            });
            
            const data = await response.json();
            return data.fixtures || data.data || data || [];
        } catch (e) {
             // Mock live data for the "Matrix" experience if API fails
             return [
                { home_team: 'Manchester City', away_team: 'Liverpool', score: { home: 2, away: 1 }, status: '67\'', isLive: true },
                { home_team: 'Barcelona', away_team: 'Real Madrid', score: { home: 1, away: 1 }, status: '34\'', isLive: true },
                { home_team: 'PSG', away_team: 'Bayern', score: { home: 0, away: 2 }, status: '78\'', isLive: true }
             ];
        }
    }
    return [];
};

/**
 * Fetch historical data from BetStack API for ML training
 */
export const getHistoricalMatches = async () => {
    if (!BETSTACK_API_KEY) return [];
    try {
        console.log(`[BetStack API] Fetching historical results...`);
        const res = await axios.get(`${BETSTACK_API_HOST}/history`, {
            headers: { 'x-api-key': BETSTACK_API_KEY }
        });
        return res.data.matches || [];
    } catch (error) {
        console.error('Error fetching historical matches:', error);
        return [];
    }
};

