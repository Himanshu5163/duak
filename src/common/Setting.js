import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ColorWheel from 'react-native-wheel-color-picker';
import { useTheme } from '../theme/ThemeContext';

const Setting = () => {
  const { setThemeColor } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose App Theme Color:</Text>
      <View style={styles.wheelContainer}>
        <ColorWheel
          initialColor="#667eea"
          onColorChangeComplete={(color) => setThemeColor(color)}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 20,
    marginBottom: 20
  },
  wheelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Setting;
