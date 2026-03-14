import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../theme/colors';
import { Cpu } from 'lucide-react-native';

const LoadingAnimation = () => {
  const spinValue = new Animated.Value(0);
  const pulseValue = new Animated.Value(0.3);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glow, { opacity: pulseValue }]} />
      <Animated.View style={[styles.ring, { transform: [{ rotate: spin }] }]}>
        <View style={styles.dot} />
      </Animated.View>
      <Cpu color={Colors.primary} size={32} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
  },
  glow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  ring: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    top: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  }
});

export default LoadingAnimation;
