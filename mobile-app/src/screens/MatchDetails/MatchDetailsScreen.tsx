import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Colors, Gaps } from '../../theme/colors';
import { ChevronLeft, Info, BarChart2, Users, History } from 'lucide-react-native';
import { useMatchDetails } from '../../hooks/useMatchDetails';
import { ActivityIndicator } from 'react-native';

const { width } = Dimensions.get('window');

const MatchDetailsScreen = ({ navigation, route }: any) => {
  const { matchId } = route.params || {};
  const { match, loading } = useMatchDetails(matchId);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!match) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: Colors.textMuted }}>Match details not found.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={{ color: Colors.primary, marginTop: 10 }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft color={Colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Match Details</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Info color={Colors.text} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Scoreboard Section */}
        <View style={styles.scoreboard}>
          <View style={styles.teamInfo}>
            <View style={styles.teamLogoPlaceholder} />
            <Text style={styles.teamName}>{match.teams.home.name}</Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={[styles.timeLabel, match.fixture.status.short === 'NS' && { color: Colors.textMuted }]}>
              {match.fixture.status.short === 'NS' ? match.fixture.status.long : `LIVE ${match.fixture.status.elapsed}'`}
            </Text>
            <Text style={styles.score}>{match.goals.home ?? 0} - {match.goals.away ?? 0}</Text>
            <Text style={styles.leagueName}>{match.league.name}</Text>
          </View>

          <View style={styles.teamInfo}>
            <View style={styles.teamLogoPlaceholder} />
            <Text style={styles.teamName}>{match.teams.away.name}</Text>
          </View>
        </View>

        {/* AI Prediction Overview */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>AI Prediction Engine</Text>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>{match.aiPrediction.confidence} Match</Text>
            </View>
          </View>
          
          <View style={styles.probGrid}>
            <ProbBar label="Home" value={match.aiPrediction.winProb.home} color={Colors.primary} />
            <ProbBar label="Draw" value={match.aiPrediction.winProb.draw} color={Colors.textMuted} />
            <ProbBar label="Away" value={match.aiPrediction.winProb.away} color={Colors.secondary} />
          </View>

          <Text style={styles.predictedScore}>Predicted Final Score: <Text style={styles.highlightText}>{match.aiPrediction.predictedScore}</Text></Text>
          <Text style={styles.analysisText}>
            {match.aiPrediction.analysis}
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsCard}>
          <View style={styles.tabHeader}>
            <Text style={[styles.tab, styles.activeTab]}>Statistics</Text>
            <Text style={styles.tab}>Lineups</Text>
            <Text style={styles.tab}>H2H</Text>
          </View>

          <StatRow label="Possession" home={match.stats.possession.home} away={match.stats.possession.away} progress={match.stats.possession.progress} />
          <StatRow label="Shots on Target" home={match.stats.shotsOnTarget.home} away={match.stats.shotsOnTarget.away} progress={match.stats.shotsOnTarget.progress} />
          <StatRow label="Corners" home={match.stats.corners.home} away={match.stats.corners.away} progress={match.stats.corners.progress} />
        </View>

        {/* Betting Insights */}
        <View style={styles.insightCard}>
          <Text style={styles.sectionTitle}>Smart Insights</Text>
          <InsightItem text="Over 2.5 goals likely (88% prob)" type="success" />
          <InsightItem text="Corner count over 10.5 (72% prob)" type="warning" />
          <InsightItem text="BTTS: Yes (Confirmed)" type="primary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ProbBar = ({ label, value, color }: any) => (
  <View style={styles.probItem}>
    <Text style={styles.probLabel}>{label}</Text>
    <View style={styles.barBg}>
      <View style={[styles.barFill, { width: `${value * 100}%`, backgroundColor: color }]} />
    </View>
    <Text style={styles.probValue}>{(value * 100).toFixed(0)}%</Text>
  </View>
);

const StatRow = ({ label, home, away, progress }: any) => (
  <View style={styles.statRowContainer}>
    <View style={styles.statLabels}>
      <Text style={styles.statValueText}>{home}</Text>
      <Text style={styles.statNameText}>{label}</Text>
      <Text style={styles.statValueText}>{away}</Text>
    </View>
    <View style={styles.statBarBg}>
      <View style={[styles.statBarFill, { width: `${progress * 100}%` }]} />
    </View>
  </View>
);

const InsightItem = ({ text, type }: any) => (
  <View style={styles.insightItem}>
    <View style={[styles.insightDot, { backgroundColor: Colors[type] }]} />
    <Text style={styles.insightText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Gaps.md,
    height: 60,
  },
  backButton: {
    backgroundColor: Colors.surface,
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButton: {
    backgroundColor: Colors.surface,
    padding: 8,
    borderRadius: 12,
  },
  scoreboard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: Gaps.lg,
    backgroundColor: Colors.surface,
    marginHorizontal: Gaps.md,
    borderRadius: 24,
    marginTop: Gaps.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  teamInfo: {
    alignItems: 'center',
    width: 80,
  },
  teamLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    marginBottom: 8,
  },
  teamName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  timeLabel: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  score: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: '900',
  },
  leagueName: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    margin: Gaps.md,
    padding: Gaps.md,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gaps.md,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  confidenceBadge: {
    backgroundColor: 'rgba(0, 245, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  confidenceText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  probGrid: {
    marginBottom: Gaps.md,
  },
  probItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  probLabel: {
    color: Colors.textMuted,
    width: 50,
    fontSize: 12,
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  probValue: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '700',
    width: 40,
    textAlign: 'right',
  },
  predictedScore: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  highlightText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 18,
  },
  analysisText: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  statsCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Gaps.md,
    marginBottom: Gaps.md,
    padding: Gaps.md,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabHeader: {
    flexDirection: 'row',
    marginBottom: Gaps.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    color: Colors.textMuted,
    paddingBottom: 10,
    marginRight: 24,
    fontSize: 14,
    fontWeight: '700',
  },
  activeTab: {
    color: Colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  statRowContainer: {
    marginBottom: 16,
  },
  statLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statValueText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  statNameText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  statBarBg: {
    height: 6,
    backgroundColor: Colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  insightCard: {
    margin: Gaps.md,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Gaps.md,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    borderColor: Colors.border,
  },
  insightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  insightText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MatchDetailsScreen;
