// src/screens/FakeCallScreen.tsx

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { useApp } from '../AppContext';

type Route = RouteProp<RootStackParamList, 'FakeCall'>;

const FakeCallScreen: React.FC = () => {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { events, presetCalls } = useApp();
  const event = events.find(e => e.id === route.params.eventId);
  const preset = event ? presetCalls.find(p => p.id === event.presetId) : undefined;

  if (!event || !preset) {
    return (
      <View style={styles.container}>
        <Text>Call not found.</Text>
        <Button title="Close" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleAccept = () => {
    // For now, just show "in call" state
    // Future: play voice clip if attached
    alert('In call (fake).');
    navigation.goBack();
  };

  const handleDecline = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Incoming call</Text>
      <Text style={styles.caller}>{preset.callerName}</Text>
      <Text style={styles.mode}>{preset.mode}</Text>

      <View style={styles.row}>
        <Button title="Decline" onPress={handleDecline} />
        <Button title="Accept" onPress={handleAccept} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: { color: '#fff', fontSize: 18, marginBottom: 8 },
  caller: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  mode: { color: '#ccc', marginBottom: 24 },
  row: { flexDirection: 'row', gap: 16 },
});

export default FakeCallScreen;
