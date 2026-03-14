import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Colors, Gaps } from '../../theme/colors';
import { ChevronLeft, Plus, ArrowDownLeft, ArrowUpRight, History, CreditCard } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const WalletScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft color={Colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <TouchableOpacity style={styles.historyButton}>
          <History color={Colors.text} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>$1,250.00</Text>
          <View style={styles.balanceMeta}>
            <Text style={styles.currencyCode}>USD</Text>
            <View style={styles.divider} />
            <Text style={styles.statusActive}>Active</Text>
          </View>
          
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Deposit')}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.primary }]}>
                <Plus color={Colors.background} size={24} />
              </View>
              <Text style={styles.actionText}>Deposit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.surface }]}>
                <ArrowUpRight color={Colors.text} size={24} />
              </View>
              <Text style={styles.actionText}>Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.surface }]}>
                <CreditCard color={Colors.text} size={24} />
              </View>
              <Text style={styles.actionText}>Cards</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
        </View>

        <TransactionItem 
          title="Deposit via Stripe" 
          date="Mar 13, 2026" 
          amount="+500.00" 
          type="in" 
        />
        <TransactionItem 
          title="VIP Subscription" 
          date="Mar 12, 2026" 
          amount="-29.99" 
          type="out" 
        />
        <TransactionItem 
          title="Match Winning: RM vs FCB" 
          date="Mar 11, 2026" 
          amount="+120.00" 
          type="in" 
        />
        <TransactionItem 
          title="Withdrawal to Bank" 
          date="Mar 10, 2026" 
          amount="-200.00" 
          type="out" 
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const TransactionItem = ({ title, date, amount, type }: any) => (
  <View style={styles.txItem}>
    <View style={[styles.txIcon, { backgroundColor: type === 'in' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 68, 68, 0.1)' }]}>
      {type === 'in' ? (
        <ArrowDownLeft color={Colors.primary} size={20} />
      ) : (
        <ArrowUpRight color={Colors.error} size={20} />
      )}
    </View>
    <View style={styles.txInfo}>
      <Text style={styles.txTitle}>{title}</Text>
      <Text style={styles.txDate}>{date}</Text>
    </View>
    <Text style={[styles.txAmount, { color: type === 'in' ? Colors.primary : Colors.text }]}>
      {amount}
    </Text>
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
    paddingVertical: 15,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  backButton: {
    padding: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  historyButton: {
    padding: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  scrollContent: {
    paddingHorizontal: Gaps.md,
    paddingTop: 10,
    paddingBottom: 40,
  },
  balanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: 30,
    // Shadows
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 5,
  },
  balanceLabel: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  balanceAmount: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 10,
  },
  balanceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  currencyCode: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
  statusActive: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  viewAll: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  txDate: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
});

export default WalletScreen;
