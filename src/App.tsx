// src/App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './AppContext';
import HomeScreen from './screens/HomeScreen';
import ScheduleCallScreen from './screens/ScheduleCallScreen';
import ScheduleTextScreen from './screens/ScheduleTextScreen';
import PresetsScreen from './screens/PresetsScreen';
import ProfilesScreen from './screens/ProfilesScreen';
import SettingsScreen from './screens/SettingsScreen';
import FakeCallScreen from './screens/FakeCallScreen';

export type RootStackParamList = {
  Tabs: undefined;
  FakeCall: { eventId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="ScheduleCall" component={ScheduleCallScreen} options={{ title: 'Call' }} />
      <Tab.Screen name="ScheduleText" component={ScheduleTextScreen} options={{ title: 'Text' }} />
      <Tab.Screen name="Presets" component={PresetsScreen} />
      <Tab.Screen name="Profiles" component={ProfilesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="FakeCall" component={FakeCallScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
