import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const StatusBadge = ({ status }) => {
  // Animation setup
  const scale = useSharedValue(0.8);

  React.useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.badgeContainer,
        animatedStyle,
        {
          backgroundColor:
            status === 'completed'
              ? '#d4edda'
              : status === 'pending'
              ? '#f8d7da'
              : status === 'in-progress'
              ? '#e2e3e5'
              : '#e2e3e5', // Default for 'disabled'
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            color:
              status === 'completed'
                ? '#155724'
                : status === 'pending'
                ? '#721c24'
                : status === 'in-progress'
                ? '#495057'
                : '#495057',
          },
        ]}
      >
        {status === 'completed'
          ? 'Completed'
          : status === 'pending'
          ? 'Pending'
          : status === 'in-progress'
          ? 'In Progress'
          : 'Pending'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    alignSelf: 'flex-start',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});

export default StatusBadge;