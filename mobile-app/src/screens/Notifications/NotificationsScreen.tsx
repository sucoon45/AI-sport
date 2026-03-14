import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Colors, Gaps } from '../../theme/colors';
import { ChevronLeft, Bell, TrendingUp, Info, CheckCircle } from 'lucide-react-native';

const NotificationsScreen = ({ navigation }: any) => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New VIP Signal Available',
      message: 'A highly accurate prediction for Real Madrid vs Barcelona is now available.',
      type: 'signal',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: '2',
      title: 'Match Result: Man City 3-1 Arsenal',
      message: 'Your prediction was successful! +$120.00 added to your wallet.',
      type: 'result',
      time: '5 hours ago',
      isRead: true
    },
    {
      id: '3',
      title: 'Wallet Top-up Successful',
      message: 'Your deposit of $500.00 via Stripe has been confirmed.',
      type: 'info',
      time: 'Yesterday',
      isRead: true
    }
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft color={Colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.markReadButton}>
          <CheckCircle color={Colors.primary} size={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.notiItem, !item.isRead && styles.unreadItem]}>
            <View style={[styles.notiIcon, { backgroundColor: getIconBg(item.type) }]}>
              {getIcon(item.type)}
            </View>
            <View style={styles.notiInfo}>
              <View style={styles.notiHeader}>
                <Text style={styles.notiTitle}>{item.title}</Text>
                {!item.isRead && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notiMessage}>{item.message}</Text>
              <Text style={styles.notiTime}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const getIcon = (type: string) => {
  switch (type) {
    case 'signal': return <TrendingUp color={Colors.secondary} size={20} />;
    case 'result': return <CheckCircle color={Colors.primary} size={20} />;
    default: return <Info color={Colors.textMuted} size={20} />;
  }
};

const getIconBg = (type: string) => {
  switch (type) {
    case 'signal': return 'rgba(0, 243, 255, 0.1)';
    case 'result': return 'rgba(0, 255, 136, 0.1)';
    default: return 'rgba(255, 255, 255, 0.05)';
  }
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
  markReadButton: {
    padding: 8,
  },
  listContent: {
    padding: Gaps.md,
  },
  notiItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unreadItem: {
    borderColor: Colors.primary + '40',
    backgroundColor: Colors.primary + '05',
  },
  notiIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notiInfo: {
    flex: 1,
  },
  notiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notiTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  notiMessage: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  notiTime: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
});

export default NotificationsScreen;
