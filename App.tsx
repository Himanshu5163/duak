import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import 'react-native-reanimated';
import { ThemeProvider } from './src/theme/ThemeContext';

const App = () => (
  <Provider store={store}>
     <ThemeProvider>
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
    </ThemeProvider>
  </Provider>
);

export default App;
