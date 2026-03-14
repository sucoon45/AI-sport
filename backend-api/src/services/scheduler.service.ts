import cron from 'node-cron';
import * as footballService from './football.service';
import { supabase } from './supabase';
import * as notificationService from './notification.service';

export const initScheduler = () => {
  // Update live scores every minute
  cron.schedule('* * * * *', async () => {
    console.log('Running task: Updating live scores');
    try {
      const liveMatches = await footballService.getLiveScores();
      // TODO: Logic to update database and broadcast via WebSockets
    } catch (error) {
      console.error('Error in live score update task:', error);
    }
  });

  // Daily task at 3 AM to fetch today's fixtures
  cron.schedule('0 3 * * *', async () => {
    console.log('Running task: Fetching and syncing daily fixtures');
    try {
      const today = new Date().toISOString().split('T')[0];
      const fixtures = await footballService.getFixtures(today);
      
      if (fixtures && fixtures.length > 0) {
        // Map API-Football data to our schema
        const matchesToUpsert = fixtures.map((f: any) => ({
          id: f.fixture.id,
          league_id: f.league.id,
          home_team_id: f.teams.home.id,
          away_team_id: f.teams.away.id,
          match_time: f.fixture.date,
          status: f.fixture.status.short,
          home_score: f.goals.home,
          away_score: f.goals.away,
          updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
          .from('matches')
          .upsert(matchesToUpsert, { onConflict: 'id' });

        if (error) throw error;
        console.log(`Synced ${fixtures.length} fixtures to database`);
      }
    } catch (error) {
      console.error('Error in daily fixture fetch task:', error);
    }
  });

  // Verify results every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running task: Verifying match results');
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];
      
      const finishedMatches = await footballService.getFinishedMatches(dateStr);
      
      for (const m of finishedMatches) {
        // Update match score in DB
        await supabase.from('matches').update({
          home_score: m.goals.home,
          away_score: m.goals.away,
          status: 'FT'
        }).eq('id', m.fixture.id);

        // Check if we had a prediction for this match
        const { data: pred } = await supabase.from('predictions').select('*').eq('match_id', m.fixture.id).single();
        
        if (pred) {
          const actualResult = m.goals.home > m.goals.away ? 'Home' : m.goals.home < m.goals.away ? 'Away' : 'Draw';
          const predictedResult = pred.home_win_prob > pred.away_win_prob && pred.home_win_prob > pred.draw_prob ? 'Home' : 
                                pred.away_win_prob > pred.home_win_prob && pred.away_win_prob > pred.draw_prob ? 'Away' : 'Draw';

          if (actualResult === predictedResult) {
             // Success notification to users who might have seen this (In a real app, track who viewed it)
             if (pred.is_vip) {
                await notificationService.broadcastNotification(
                  'VIP Signal Success! ✅',
                  `${m.teams.home.name} vs ${m.teams.away.name} ended ${m.goals.home}-${m.goals.away}. Our AI was correct!`,
                  'result'
                );
             }
          }
        }
      }
    } catch (error) {
      console.error('Error in result verification task:', error);
    }
  });
};
