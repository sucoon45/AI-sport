import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Colors, Gaps } from '../../theme/colors';
import { Trophy, Activity, Star, Bell, Target } from 'lucide-react-native';
import LoadingAnimation from '../../components/LoadingAnimation';
import { useFixtures } from '../../hooks/useFixtures';
import { useLiveScores } from '../../hooks/useLiveScores';
import { usePredictions } from '../../hooks/usePredictions';
import { useTranslation } from 'react-i18next';

const HomeScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { fixtures, loading, refresh } = useFixtures();
  const { liveScores } = useLiveScores();
  const { predictions, loading: predLoading } = usePredictions('All');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('welcome')}</Text>
          <Text style={styles.title}>BetMind AI</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Bell color={Colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {liveScores.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('live_now')}</Text>
              <View style={styles.liveIndicator} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.upcomingScroll}>
              {liveScores.map((item: any, index: number) => (
                <LiveMatchCard 
                  key={index}
                  homeTeam={item.teams.home.name} 
                  awayTeam={item.teams.away.name} 
                  score={`${item.goals.home} - ${item.goals.away}`}
                  status={item.fixture.status.elapsed + "'"}
                  onPress={() => navigation.navigate('MatchDetails', { matchId: item.fixture.id })}
                />
              ))}
            </ScrollView>
          </>
        )}

        <Text style={styles.sectionTitle}>{t('upcoming')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.upcomingScroll}>
          {loading ? (
            <View style={{ paddingHorizontal: 40, paddingVertical: 20 }}>
              <LoadingAnimation />
            </View>
          ) : (
            fixtures.map((item: any, index: number) => (
              <MatchCard 
                key={index}
                homeTeam={item.teams.home.name} 
                awayTeam={item.teams.away.name} 
                time={new Date(item.fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                aiProb="72%" 
                onPress={() => navigation.navigate('MatchDetails', { matchId: item.fixture.id })}
              />
            ))
          )}
          {fixtures.length === 0 && !loading && (
            <MatchCard 
              homeTeam="Man City" 
              awayTeam="Liverpool" 
              time="15:30" 
              aiProb="72%" 
              onPress={() => navigation.navigate('MatchDetails', { matchId: 1 })}
            />
          )}
        </ScrollView>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>{t('ai_analytics')}</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Total Preds" value="1,280" icon={<Activity color={Colors.primary} size={20} />} />
            <StatCard label="Success Rate" value="84%" icon={<Trophy color={Colors.accent} size={20} />} />
          </View>
        </View>


        <Text style={styles.sectionTitle}>{t('top_predictions')}</Text>
        {predLoading ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <LoadingAnimation />
            <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 10, fontWeight: '700' }}>INITIALIZING AI ENGINE...</Text>
          </View>
        ) : (
          predictions.slice(0, 3).map((item: any, index: number) => (
            <PredictionItem 
              key={item.id}
              match={item.match} 
              pick={item.prediction} 
              odds={item.odds} 
              confidence={item.confidence} 
              isVip={item.isVip}
              onPress={() => navigation.navigate('MatchDetails', { matchId: item.id })}
            />
          ))
        )}
        {predictions.length === 0 && !predLoading && (
          <PredictionItem 
            match="Milan vs Inter" 
            pick="BTTS - Yes" 
            odds="2.10" 
            confidence="Vip" 
            isVip
            onPress={() => {}}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const MatchCard = ({ homeTeam, awayTeam, time, aiProb, onPress }: any) => (
  <TouchableOpacity style={styles.matchCard} onPress={onPress}>
    <View style={styles.matchTeams}>
      <Text style={styles.teamName}>{homeTeam}</Text>
      <Text style={styles.vs}>vs</Text>
      <Text style={styles.teamName}>{awayTeam}</Text>
    </View>
    <View style={styles.matchFooter}>
      <Text style={styles.matchTime}>{time}</Text>
      <View style={styles.probBadge}>
        <Text style={styles.probText}>AI {aiProb}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const LiveMatchCard = ({ homeTeam, awayTeam, score, status, onPress }: any) => (
  <TouchableOpacity style={[styles.matchCard, styles.liveCard]} onPress={onPress}>
    <View style={styles.matchTeams}>
      <Text style={[styles.teamName, { fontSize: 13 }]}>{homeTeam}</Text>
      <Text style={styles.liveScore}>{score}</Text>
      <Text style={[styles.teamName, { fontSize: 13 }]}>{awayTeam}</Text>
    </View>
    <View style={styles.matchFooter}>
      <Text style={styles.statusLive}>{status}</Text>
      <View style={styles.liveBadge}>
        <Text style={styles.liveBadgeText}>LIVE</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const StatCard = ({ label, value, icon }: any) => (
  <View style={styles.statCard}>
    {icon}
    <View style={styles.statInfo}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

const PredictionItem = ({ match, pick, odds, confidence, isVip, onPress }: any) => (
  <TouchableOpacity 
    style={[styles.predictionItem, isVip && styles.vipItem]}
    onPress={onPress}
  >
    <View>
      <Text style={styles.predMatch}>{match}</Text>
      <Text style={styles.predPick}>{pick}</Text>
    </View>
    <View style={styles.predRight}>
      <Text style={styles.predOdds}>{odds}</Text>
      <View style={[styles.confBadge, isVip && styles.vipBadge]}>
        {isVip && <Star size={12} color={Colors.background} style={{marginRight: 4}} />}
        <Text style={[styles.confText, isVip && styles.vipConfText]}>{confidence}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Gaps.md,
    paddingVertical: Gaps.md,
  },
  greeting: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  iconButton: {
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 12,
  },
  scrollContent: {
    paddingHorizontal: Gaps.md,
    paddingBottom: 100,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: Gaps.lg,
    marginBottom: Gaps.md,
  },
  upcomingScroll: {
    marginHorizontal: -Gaps.md,
    paddingHorizontal: Gaps.md,
  },
  matchCard: {
    backgroundColor: Colors.surface,
    width: 200,
    padding: Gaps.md,
    borderRadius: 20,
    marginRight: Gaps.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  matchTeams: {
    alignItems: 'center',
    marginBottom: Gaps.lg,
  },
  teamName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  vs: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '900',
    marginVertical: 4,
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchTime: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  probBadge: {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  probText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Gaps.xs,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    marginLeft: 8,
  },
  liveCard: {
    borderColor: Colors.accent + '40',
    backgroundColor: Colors.surface + '80',
  },
  liveScore: {
    color: Colors.accent,
    fontSize: 18,
    fontWeight: '800',
    marginHorizontal: 8,
  },
  statusLive: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  liveBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveBadgeText: {
    color: Colors.background,
    fontSize: 9,
    fontWeight: '900',
  },
  statsContainer: {
    marginBottom: Gaps.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Gaps.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Gaps.md,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  predictionItem: {
    backgroundColor: Colors.surface,
    padding: Gaps.md,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gaps.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  predRight: {
    alignItems: 'flex-end',
  },
  vipItem: {
    borderColor: Colors.secondary,
    borderWidth: 2,
  },
  predMatch: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  predPick: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  predOdds: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    marginBottom: 4,
  },
  confBadge: {
    backgroundColor: Colors.glass,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  vipBadge: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  confText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  vipConfText: {
    color: Colors.background,
  },
});

export default HomeScreen;
