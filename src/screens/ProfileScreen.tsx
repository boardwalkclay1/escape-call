// src/screens/ProfilesScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../AppContext';
import { Profile } from '../types';

const ProfilesScreen: React.FC = () => {
  const {
    profiles,
    presetCalls,
    presetTexts,
    addOrUpdateProfile,
    deleteProfile,
    scheduleEvent,
  } = useApp();

  const [name, setName] = useState('');
  const [callPresetId, setCallPresetId] = useState<string | null>(null);
  const [textPresetId, setTextPresetId] = useState<string | null>(null);
  const [callDelay, setCallDelay] = useState('10');
  const [textDelay, setTextDelay] = useState('5');

  const handleCreate = async () => {
    await addOrUpdateProfile({
      name,
      callPresetId,
      textPresetId,
      defaultCallDelayMinutes: Number(callDelay) || null,
      defaultTextDelayMinutes: Number(textDelay) || null,
    });
    setName('');
  };

  const useProfileNow = async (profile: Profile) => {
    if (profile.callPresetId && profile.defaultCallDelayMinutes != null) {
      const time = new Date(
        Date.now() + profile.defaultCallDelayMinutes * 60 * 1000,
      ).toISOString();
      await scheduleEvent({
        type: 'call',
        time,
        presetId: profile.callPresetId,
        profileId: profile.id,
      });
    }
    if (profile.textPresetId && profile.defaultTextDelayMinutes != null) {
      const time = new Date(
        Date.now() + profile.defaultTextDelayMinutes * 60 * 1000,
      ).toISOString();
      await scheduleEvent({
        type: 'text',
        time,
        presetId: profile.textPresetId,
        profileId: profile.id,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profiles</Text>

      {profiles.map(p => (
        <View key={p.id} style={styles.item}>
          <Text style={styles.itemTitle}>{p.name}</Text>
          <Text>
            Call preset:{' '}
            {presetCalls.find(c => c.id === p.callPresetId)?.title ?? 'None'}
          </Text>
          <Text>
            Text preset:{' '}
            {presetTexts.find(t => t.id === p.textPresetId)?.title ?? 'None'}
          </Text>
          <Button title="Use now" onPress={() => useProfileNow(p)} />
          <Button title="Delete" onPress={() => deleteProfile(p.id)} />
        </View>
      ))}

      <Text style={styles.subtitle}>Create / Edit Profile</Text>
      <Text>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text>Call preset</Text>
      {presetCalls.map(c => (
        <Button
          key={c.id}
          title={`${c.title}${callPresetId === c.id ? ' ✓' : ''}`}
          onPress={() => setCallPresetId(c.id)}
        />
      ))}

      <Text>Text preset</Text>
      {presetTexts.map(t => (
        <Button
          key={t.id}
          title={`${t.title}${textPresetId === t.id ? ' ✓' : ''}`}
          onPress={() => setTextPresetId(t.id)}
        />
      ))}

      <Text>Default call delay (min)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={callDelay}
        onChangeText={setCallDelay}
      />

      <Text>Default text delay (min)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={textDelay}
        onChangeText={setTextDelay}
      />

      <Button title="Save Profile" onPress={handleCreate} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 18, fontWeight: '600', marginVertical: 12 },
  item: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 8,
  },
  itemTitle: { fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
  },
});

export default ProfilesScreen;
