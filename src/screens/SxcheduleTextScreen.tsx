// src/screens/ScheduleTextScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../AppContext';
import { Mode, PresetText } from '../types';

const modes: { label: string; value: Mode }[] = [
  { label: 'Urgent', value: 'urgent' },
  { label: 'Family member died', value: 'family_death' },
  { label: 'Hospital', value: 'hospital' },
  { label: 'Work', value: 'work' },
  { label: 'Custom', value: 'custom' },
];

const ScheduleTextScreen: React.FC = () => {
  const { presetTexts, addOrUpdateTextPreset, scheduleEvent } = useApp();
  const [delay, setDelay] = useState('5');
  const [usePreset, setUsePreset] = useState(true);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('urgent');
  const [messageText, setMessageText] = useState('');

  const handleSchedule = async () => {
    const delayMinutes = Number(delay) || 1;
    const time = new Date(Date.now() + delayMinutes * 60 * 1000).toISOString();

    let presetId = selectedPresetId;

    if (!usePreset) {
      const preset: Partial<PresetText> = {
        title: 'Custom',
        mode,
        messageText,
        isDefault: false,
      };
      await addOrUpdateTextPreset(preset);
      const created = presetTexts[presetTexts.length - 1];
      presetId = created?.id;
    }

    if (!presetId) return;

    await scheduleEvent({
      type: 'text',
      time,
      presetId,
      profileId: null,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Schedule Text</Text>

      <Text>Delay (minutes, 1–30)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={delay}
        onChangeText={setDelay}
      />

      <View style={styles.section}>
        <Button
          title={`Use preset: ${usePreset ? 'ON' : 'OFF'}`}
          onPress={() => setUsePreset(!usePreset)}
        />
      </View>

      {usePreset ? (
        <View style={styles.section}>
          <Text>Choose preset</Text>
          {presetTexts.map(p => (
            <Button
              key={p.id}
              title={`${p.title}${selectedPresetId === p.id ? ' ✓' : ''}`}
              onPress={() => setSelectedPresetId(p.id)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.section}>
          <Text>Mode</Text>
          {modes.map(m => (
            <Button
              key={m.value}
              title={`${m.label}${mode === m.value ? ' ✓' : ''}`}
              onPress={() => setMode(m.value)}
            />
          ))}
          <Text>Message text</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            multiline
            value={messageText}
            onChangeText={setMessageText}
          />
        </View>
      )}

      <Button title="Schedule Text" onPress={handleSchedule} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
  },
  section: { marginVertical: 12 },
});

export default ScheduleTextScreen;
