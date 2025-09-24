import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const ActionButton = ({
  onPress = () => {},
  iconSource, // image source
  iconSize = 24,
  disabled = false,
  style = {},
  iconStyle = {},
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Image
        source={iconSource}
        style={[
          {
            width: iconSize,
            height: iconSize,
            resizeMode: 'contain',
          },
          iconStyle,
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  disabled: {
    backgroundColor: '#aaa',
  },
});

export default ActionButton;
