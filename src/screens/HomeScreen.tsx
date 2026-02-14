// src/screens/HomeScreen.tsx

import React, { useMemo } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useApp } from '../AppContext';
import { Profile } from '../types';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const { settings, profiles, events, scheduleEvent } = useApp();
  const navigation = useNavigation<Nav>();

  const nextEvent = useMemo(
    () =>
      events
        .filter(e => e.status === 'pending')
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())[0],
    [events],
  );

  const getProfileById = (id: string | null): Profile | undefined =>
    profiles.find(p => p.id === id);

  const handleQuick = async (type: 'call' | 'text', minutes: number) => {
    if (!settings) return;
    const profileId =
      type === 'call'
        ? settings.defaultQuickRingProfileId
        : settings.defaultQuickTextProfileId;
    const profile = profileId ? getProfileById(profileId) : undefined;
    if (!profile) return;

    const presetId =
      type === 'call' ? profile.callPresetId : profile.textPresetId;
    if (!presetId) return;

    const time = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    await scheduleEvent({
      type,
      time,
      presetId,
      profileId: profile.id,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EscapeCall</Text>
      {settings && (
        <Text style={styles.subtitle}>
          Call feature: {settings.hasPaidCallFeature ? 'Unlocked' : 'Locked'}
        </Text>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Ring</Text>
        <View style={styles.row}>
          <Button title="1 min" onPress={() => handleQuick('call', 1)} />
          <Button title="5 min" onPress={() => handleQuick('call', 5)} />
          <Button title="10 min" onPress={() => handleQuick('call', 10)} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Text</Text>
        <View style={styles.row}>
          <Button title="1 min" onPress={() => handleQuick('text', 1)} />
          <Button title="5 min" onPress={() => handleQuick('text', 5)} />
          <Button title="10 min" onPress={() => handleQuick('text', 10)} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Next Event</Text>
        {nextEvent ? (
          <Text>
            {nextEvent.type.toUpperCase()} at{' '}
            {new Date(nextEvent.time).toLocaleTimeString()}
          </Text>
        ) : (
          <Text>No events scheduled.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Button
          title="Go to Schedule"
          onPress={() => navigation.navigate('Tabs')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { marginTop: 4, marginBottom: 16 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default HomeScreen;
