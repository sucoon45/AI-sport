import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Share, ScrollView, Clipboard, Alert } from 'react-native';
import { Colors, Gaps } from '../../theme/colors';
import { ChevronLeft, Share2, Copy, Users, Gift, TrendingUp } from 'lucide-react-native';
import { useUser } from '../../hooks/useUser';
import { supabase } from '../../services/supabase';
import { useTranslation } from 'react-i18next';

const AffiliateScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [stats, setStats] = useState({ totalReferrals: 0, totalEarned: 0 });
  const referralCode = user?.referral_code || 'AI_GUEST';

  useEffect(() => {
    fetchReferralStats();
  }, [user]);

  const fetchReferralStats = async () => {
    if (!user?.id) return;
    const { data: referrals, count } = await supabase
      .from('referrals')
      .select('*', { count: 'exact' })
      .eq('referrer_id', user.id);
    
    if (referrals) {
      const earned = referrals.reduce((sum, r) => sum + (r.bonus_amount || 0), 0);
      setStats({ totalReferrals: count || 0, totalEarned: earned });
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Join AI SPORT and get $10 free bonus! Use my code: ${referralCode} - Download now at [App Link]`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(referralCode);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft color={Colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('affiliate_program')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Gift color={Colors.primary} size={40} />
          </View>
          <Text style={styles.heroTitle}>{t('refer_earn')}</Text>
          <Text style={styles.heroSub}>{t('refer_desc')}</Text>
        </View>

        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>{t('your_code')}</Text>
          <View style={styles.codeRow}>
            <Text style={styles.codeValue}>{referralCode}</Text>
            <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
              <Copy color={Colors.primary} size={20} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={onShare}>
            <Share2 color={Colors.background} size={20} style={{ marginRight: 10 }} />
            <Text style={styles.shareButtonText}>{t('invite_friends')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Users color={Colors.primary} size={24} />
            <Text style={styles.statValue}>{stats.totalReferrals}</Text>
            <Text style={styles.statLabel}>{t('total_referrals')}</Text>
          </View>
          <View style={styles.statBox}>
            <TrendingUp color={Colors.secondary} size={24} />
            <Text style={styles.statValue}>${stats.totalEarned.toFixed(2)}</Text>
            <Text style={styles.statLabel}>{t('total_earned')}</Text>
          </View>
        </View>

        <View style={styles.howItWorks}>
          <Text style={styles.sectionTitle}>{t('how_it_works')}</Text>
          <Step num="1" text={t('step_1')} />
          <Step num="2" text={t('step_2')} />
          <Step num="3" text={t('step_3')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Step = ({ num, text }: any) => (
  <View style={styles.stepRow}>
    <View style={styles.stepNum}>
      <Text style={styles.stepNumText}>{num}</Text>
    </View>
    <Text style={styles.stepText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Gaps.md,
    paddingVertical: 15,
  },
  headerTitle: { color: Colors.text, fontSize: 18, fontWeight: '700' },
  backButton: { padding: 8, backgroundColor: Colors.surface, borderRadius: 12 },
  content: { padding: Gaps.md },
  hero: { alignItems: 'center', marginVertical: 30 },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  heroSub: {
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 10,
    lineHeight: 22,
  },
  codeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  codeLabel: { color: Colors.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginVertical: 15,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  codeValue: { color: Colors.primary, fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  copyButton: { padding: 5 },
  shareButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    borderRadius: 16,
    width: '100%',
    marginTop: 10,
  },
  shareButtonText: { color: Colors.background, fontSize: 16, fontWeight: '800' },
  statsGrid: { flexDirection: 'row', gap: 15, marginTop: 20 },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  statValue: { color: Colors.text, fontSize: 20, fontWeight: '800', marginTop: 10 },
  statLabel: { color: Colors.textMuted, fontSize: 12, fontWeight: '600', marginTop: 4 },
  howItWorks: { marginTop: 40 },
  sectionTitle: { color: Colors.text, fontSize: 18, fontWeight: '800', marginBottom: 20 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 20 },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumText: { color: Colors.primary, fontSize: 14, fontWeight: '900' },
  stepText: { color: Colors.textMuted, fontSize: 14, fontWeight: '500', flex: 1 },
});

export default AffiliateScreen;
