import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Colors, Gaps } from '../../theme/colors';
import { ChevronLeft, CreditCard, Landmark, CheckCircle2 } from 'lucide-react-native';
import { createDepositIntent } from '../../services/api.service';
import { useAuth } from '../../hooks/useAuth';

const DepositScreen = ({ navigation }: any) => {
  const { session } = useAuth();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'stripe' | 'paystack'>('stripe');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const data = await createDepositIntent(Number(amount), method, session?.user?.id || '');
      
      // In a real app, we'd now use @stripe/stripe-react-native to present payment sheet
      // or open Paystack checkout URL.
      // For demo, we simulate success after initialization.
      
      Alert.alert(
        'Payment Initialized', 
        `Redirecting to ${method === 'stripe' ? 'Stripe' : 'Paystack'}...`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft color={Colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deposit Funds</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Enter Amount (USD)</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={Colors.textMuted}
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <Text style={styles.label}>Select Payment Method</Text>
        <View style={styles.methodRow}>
          <TouchableOpacity 
            style={[styles.methodCard, method === 'stripe' && styles.selectedMethod]} 
            onPress={() => setMethod('stripe')}
          >
            <CreditCard color={method === 'stripe' ? Colors.primary : Colors.textMuted} size={32} />
            <Text style={[styles.methodText, method === 'stripe' && styles.selectedMethodText]}>Stripe</Text>
            {method === 'stripe' && <CheckCircle2 size={16} color={Colors.primary} style={styles.check} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.methodCard, method === 'paystack' && styles.selectedMethod]} 
            onPress={() => setMethod('paystack')}
          >
            <Landmark color={method === 'paystack' ? Colors.primary : Colors.textMuted} size={32} />
            <Text style={[styles.methodText, method === 'paystack' && styles.selectedMethodText]}>Paystack</Text>
            {method === 'paystack' && <CheckCircle2 size={16} color={Colors.primary} style={styles.check} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.depositButton} 
          onPress={handleDeposit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text style={styles.depositButtonText}>Continue to Payment</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.safetyNote}>
          Your payment is secured with 256-bit encryption. We do not store your card details.
        </Text>
      </ScrollView>
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
  },
  label: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    height: 70,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currencySymbol: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: '700',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  methodRow: {
    flexDirection: 'row',
    gap: 15,
  },
  methodCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  selectedMethod: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  methodText: {
    color: Colors.textMuted,
    marginTop: 10,
    fontWeight: '700',
    fontSize: 14,
  },
  selectedMethodText: {
    color: Colors.primary,
  },
  check: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  depositButton: {
    backgroundColor: Colors.primary,
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  depositButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
  safetyNote: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
});

export default DepositScreen;
