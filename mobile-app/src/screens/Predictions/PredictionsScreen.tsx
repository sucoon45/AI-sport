import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Colors, Gaps } from '../../theme/colors';
import { Search, Filter, Star, Lock } from 'lucide-react-native';
import { usePredictions } from '../../hooks/usePredictions';

const CATEGORIES = ['All', 'Win/Draw/Loss', 'Over/Under', 'BTTS', 'Corners', 'VIP'];

const PredictionsScreen = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { predictions, loading } = usePredictions(activeCategory);
  const [isSubscribed, setIsSubscribed] = useState(false); // Mock subscription state

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Predictions</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Search color={Colors.text} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Filter color={Colors.text} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.categoryItem, activeCategory === item && styles.activeCategoryItem]}
              onPress={() => setActiveCategory(item)}
            >
              <Text style={[styles.categoryText, activeCategory === item && styles.activeCategoryText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
          contentContainerStyle={{ paddingHorizontal: Gaps.md }}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={predictions}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <PredictionLargeCard 
              match={item.match}
              league={item.league}
              prediction={item.prediction}
              odds={item.odds}
              confidence={item.confidence}
              isVip={item.isVip}
              locked={item.isVip && !isSubscribed}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const PredictionLargeCard = ({ match, league, prediction, odds, confidence, isVip, locked }: any) => (
  <TouchableOpacity style={[styles.card, isVip && styles.vipCard]}>
    <View style={styles.cardTop}>
      <View>
        <Text style={styles.leagueName}>{league}</Text>
        <Text style={styles.matchName}>{match}</Text>
      </View>
      {isVip && (
        <View style={styles.vipBadge}>
          <Star color={Colors.background} size={12} fill={Colors.background} />
          <Text style={styles.vipText}>VIP</Text>
        </View>
      )}
    </View>
    
    <View style={styles.cardBottom}>
      {locked ? (
        <View style={styles.lockOverlay}>
          <Lock color={Colors.secondary} size={20} />
          <Text style={styles.lockText}>Subscribe to unlock VIP Prediction</Text>
        </View>
      ) : (
        <>
          <View>
            <Text style={styles.label}>Prediction</Text>
            <Text style={styles.value}>{prediction}</Text>
          </View>
          <View style={styles.cardActions}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Odds</Text>
              <Text style={styles.statValue}>{odds}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Conf.</Text>
              <Text style={styles.statValue}>{confidence}</Text>
            </View>
          </View>
        </>
      )}
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
    padding: Gaps.md,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 12,
  },
  categoryContainer: {
    height: 50,
    marginBottom: Gaps.md,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginRight: 10,
    height: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeCategoryItem: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  activeCategoryText: {
    color: Colors.background,
  },
  listContent: {
    paddingHorizontal: Gaps.md,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  vipCard: {
    borderColor: Colors.secondary,
    borderWidth: 2,
    backgroundColor: 'rgba(112, 0, 255, 0.05)',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  leagueName: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  matchName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  vipText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '900',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 60,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  statValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  lockOverlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lockText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PredictionsScreen;
