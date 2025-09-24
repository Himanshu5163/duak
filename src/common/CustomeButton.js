import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // or FontAwesome, MaterialIcons, etc.

const CustomeButton = ({
  onPress = () => {},
  iconName = 'add',
  iconSize = 24,
  iconColor = '#fff',
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Ionicons name={iconName} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    width:30,
    alignItems:'center',
    padding:4
  },
  disabled: {
    backgroundColor: '#aaa',
  },
});

export default CustomeButton;
