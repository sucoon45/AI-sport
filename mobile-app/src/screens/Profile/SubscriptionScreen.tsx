import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Colors, Gaps } from '../../theme/colors';
import { ChevronLeft, Star, Check, ShieldCheck, Zap, TrendingUp } from 'lucide-react-native';
import { useUser } from '../../hooks/useUser';

const SubscriptionScreen = ({ navigation }: any) => {
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Pro',
      price: '$29.99',
      period: '/mo',
      features: ['95%+ Accuracy Signals', 'Unlimited VIP Predictions', 'Real-time Goal Alerts', 'Priority Support'],
      recommended: true
    },
    {
      id: 'yearly',
      name: 'Yearly Elite',
      price: '$199.99',
      period: '/yr',
      features: ['Everything in Monthly', '2 Months Free', 'Advanced AI Insights', 'Early Access to Beta'],
      recommended: false
    }
  ];

  const handleSubscribe = async (planId: string) => {
    // In a real app we'd trigger a checkout session
    setLoading(true);
    setTimeout(() => {
       setLoading(false);
       Alert.alert('Subscribed!', 'Welcome to the VIP club. Your account is being upgraded.', [
         { text: 'Awesome', onPress: () => navigation.goBack() }
       ]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft color={Colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VIP Membership</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
             <Star color={Colors.primary} size={40} fill={Colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Unlock Premium Insights</Text>
          <Text style={styles.heroSub}>Join 10,000+ winners today with our high-accuracy AI signals.</Text>
        </View>

        {plans.map((plan) => (
          <TouchableOpacity 
            key={plan.id}
            style={[styles.planCard, plan.recommended && styles.recommendedCard]}
            onPress={() => handleSubscribe(plan.id)}
            disabled={loading}
          >
            {plan.recommended && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>MOST POPULAR</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>
              </View>
              <Zap color={plan.recommended ? Colors.primary : Colors.textMuted} size={24} />
            </View>

            <View style={styles.featuresList}>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Check color={Colors.primary} size={16} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.planButton, plan.recommended && styles.recommendedButton]}>
              <Text style={[styles.planButtonText, plan.recommended && styles.recommendedButtonText]}>
                Get Started
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.trustFooter}>
           <View style={styles.trustItem}>
             <ShieldCheck color={Colors.textMuted} size={16} />
             <Text style={styles.trustText}>Safe & Secure Payment</Text>
           </View>
           <View style={styles.trustItem}>
             <TrendingUp color={Colors.textMuted} size={16} />
             <Text style={styles.trustText}>Cancel Anytime</Text>
           </View>
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

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
  content: {
    padding: Gaps.md,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    marginVertical: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSub: {
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  planCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  recommendedCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.primary + '03',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 12,
  },
  badgeText: {
    color: Colors.background,
    fontSize: 10,
    fontWeight: '900',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  planName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: '900',
  },
  planPeriod: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
  featuresList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  featureText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  planButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendedButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  planButtonText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  recommendedButtonText: {
    color: Colors.background,
  },
  trustFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 10,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default SubscriptionScreen;
