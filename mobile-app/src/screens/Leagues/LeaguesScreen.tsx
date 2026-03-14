import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Colors, Gaps } from '../../theme/colors';
import { Search } from 'lucide-react-native';
import { useLeagues } from '../../hooks/useLeagues';
import { ActivityIndicator } from 'react-native';

const LeaguesScreen = () => {
  const { leagues, loading } = useLeagues();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leagues</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search color={Colors.text} size={20} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {leagues.map((league) => (
            <View key={league.id} style={styles.tableCard}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableTitle}>{league.name}</Text>
                <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
              </View>
              
              {league.standings.map((row: any) => (
                <StandingRow 
                  key={row.pos}
                  pos={row.pos.toString()} 
                  team={row.team} 
                  mp={row.mp.toString()} 
                  gd={row.gd.toString()} 
                  pts={row.pts.toString()} 
                  isSelected={row.pos === 1} 
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const StandingRow = ({ pos, team, mp, gd, pts, isSelected }: any) => (
  <View style={[styles.standingRow, isSelected && styles.selectedRow]}>
    <View style={styles.standingLeft}>
      <Text style={styles.positionText}>{pos}</Text>
      <View style={styles.miniLogo} />
      <Text style={styles.teamNameText}>{team}</Text>
    </View>
    <View style={styles.standingRight}>
      <Text style={styles.statsText}>{mp}</Text>
      <Text style={[styles.statsText, { width: 40 }]}>{gd}</Text>
      <Text style={styles.ptsText}>{pts}</Text>
    </View>
  </View>
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
    padding: Gaps.md,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  searchButton: {
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 12,
  },
  scrollContent: {
    paddingHorizontal: Gaps.md,
    paddingBottom: 40,
  },
  tableCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Gaps.md,
    marginBottom: Gaps.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gaps.lg,
    paddingHorizontal: 4,
  },
  tableTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  viewAll: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  standingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  selectedRow: {
    backgroundColor: 'rgba(0, 245, 255, 0.05)',
  },
  standingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  positionText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    width: 24,
  },
  miniLogo: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: Colors.background,
    marginRight: 10,
  },
  teamNameText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  standingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statsText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    width: 20,
    textAlign: 'center',
  },
  ptsText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '800',
    width: 24,
    textAlign: 'center',
  },
});

export default LeaguesScreen;
