import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUser = async (user, token) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    if (token) {
      await AsyncStorage.setItem('access_token', token);
    }
  } catch (e) {
    console.error('Error storing user', e);
  }
};

export const getUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting user', e);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('access_token');
  } catch (e) {
    console.error('Error getting token', e);
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('access_token');
  } catch (e) {
    console.error('Error removing user', e);
  }
};
