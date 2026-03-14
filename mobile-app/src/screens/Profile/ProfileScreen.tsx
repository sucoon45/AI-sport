import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { Colors, Gaps } from '../../theme/colors';
import { User, Bell, Shield, CreditCard, LogOut, ChevronRight, Star, Gift, Globe } from 'lucide-react-native';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import { ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

const ProfileScreen = ({ navigation }: any) => {
  const { t, i18n } = useTranslation();
  const { user, loading, togglePremium } = useUser();
  const { signOut } = useAuth();

  const changeLanguage = () => {
    Alert.alert(
      "Select Language",
      "Choose your preferred language",
      [
        { text: "English", onPress: () => i18n.changeLanguage('en') },
        { text: "Français", onPress: () => i18n.changeLanguage('fr') },
        { text: "Português", onPress: () => i18n.changeLanguage('pt') },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarPlaceholder}>
            <User color={Colors.textMuted} size={40} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={[styles.badge, user.isPremium && { backgroundColor: Colors.secondary }]}>
              <Text style={[styles.badgeText, user.isPremium && { color: Colors.background }]}>{user.plan}</Text>
            </View>
          </View>
        </View>

        {/* Premium Banner */}
        {!user.isPremium && (
          <TouchableOpacity style={styles.premiumBanner} onPress={() => navigation.navigate('Subscription')}>
            <View style={styles.premiumTextContainer}>
              <Text style={styles.premiumTitle}>Upgrade to VIP</Text>
              <Text style={styles.premiumSubtitle}>Get 95% accurate AI signals daily</Text>
            </View>
            <View style={styles.premiumIcon}>
              <Star color={Colors.background} size={24} fill={Colors.background} />
            </View>
          </TouchableOpacity>
        )}

        {/* Settings Groups */}
        <SettingsGroup title="Account Settings">
          <SettingsItem icon={<User size={20} color={Colors.primary} />} label="Personal Information" />
          <SettingsItem 
            icon={<CreditCard size={20} color={Colors.primary} />} 
            label="My Wallet & Payments" 
            onPress={() => navigation.navigate('Wallet')}
          />
          <SettingsItem icon={<Shield size={20} color={Colors.primary} />} label="Security & Privacy" />
          <SettingsItem 
            icon={<CreditCard size={20} color={Colors.primary} />} 
            label="Subscription Plan" 
            onPress={() => navigation.navigate('Subscription')}
          />
          <SettingsItem 
            icon={<Gift size={20} color={Colors.primary} />} 
            label="Affiliate Program" 
            onPress={() => navigation.navigate('Affiliate')}
          />
        </SettingsGroup>

        <SettingsGroup title="Preferences">
          <SettingsItem 
            icon={<Bell size={20} color={Colors.secondary} />} 
            label="Push Notifications" 
            right={<Switch value={true} trackColor={{ false: Colors.border, true: Colors.primary }} />} 
          />
          <SettingsItem 
            icon={<Bell size={20} color={Colors.secondary} />} 
            label="Match Alerts" 
            right={<Switch value={false} trackColor={{ false: Colors.border, true: Colors.primary }} />} 
          />
          <SettingsItem 
            icon={<Globe size={20} color={Colors.accent} />} 
            label="Language" 
            onPress={changeLanguage}
          />
        </SettingsGroup>

        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.4 (Build 42)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingsGroup = ({ title, children }: any) => (
  <View style={styles.groupContainer}>
    <Text style={styles.groupTitle}>{title}</Text>
    <View style={styles.groupCard}>
      {children}
    </View>
  </View>
);

const SettingsItem = ({ icon, label, right, onPress }: any) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <View style={styles.settingsItemLeft}>
      <View style={styles.itemIconContainer}>{icon}</View>
      <Text style={styles.settingsItemLabel}>{label}</Text>
    </View>
    {right ? right : <ChevronRight size={20} color={Colors.textMuted} />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Gaps.md,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: Gaps.md,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Gaps.lg,
    borderRadius: 24,
    marginBottom: Gaps.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  userInfo: {
    marginLeft: Gaps.md,
    flex: 1,
  },
  userName: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  userEmail: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  premiumBanner: {
    backgroundColor: Colors.primary,
    padding: 24,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gaps.xl,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    color: Colors.background,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  premiumSubtitle: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
  premiumIcon: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 12,
    borderRadius: 16,
  },
  groupContainer: {
    marginBottom: Gaps.xl,
  },
  groupTitle: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(218, 54, 51, 0.1)',
    borderRadius: 24,
    gap: 12,
    marginTop: Gaps.md,
    borderWidth: 1,
    borderColor: 'rgba(218, 54, 51, 0.2)',
  },
  logoutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '800',
  },
  versionText: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: Gaps.xl,
  },
});

export default ProfileScreen;
