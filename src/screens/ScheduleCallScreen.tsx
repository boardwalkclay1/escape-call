// src/screens/ScheduleCallScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useApp } from '../AppContext';
import { Mode } from '../types';

const modes: { label: string; value: Mode }[] = [
  { label: 'Urgent', value: 'urgent' },
  { label: 'Family member died', value: 'family_death' },
  { label: 'Hospital', value: 'hospital' },
  { label: 'Work', value: 'work' },
  { label: 'Custom', value: 'custom' },
];

const ScheduleCallScreen: React.FC = () => {
  const { settings, presetCalls, addOrUpdateCallPreset, scheduleEvent } = useApp();
  const [delay, setDelay] = useState('10');
  const [callerName, setCallerName] = useState('Mom');
  const [mode, setMode] = useState<Mode>('urgent');
  const [title, setTitle] = useState('Mom – Urgent');

  const handleSchedule = async () => {
    const delayMinutes = Number(delay) || 1;
    const time = new Date(Date.now() + delayMinutes * 60 * 1000).toISOString();

    // For simplicity, create a one-off preset for this call
    const presetTitle = title || `${callerName} – ${mode}`;
    const preset = {
      title: presetTitle,
      callerName,
      mode,
      defaultDelayMinutes: delayMinutes,
      isDefault: false,
    };
    await addOrUpdateCallPreset(preset);
    const created = presetCalls.find(p => p.title === presetTitle && p.callerName === callerName);
    const presetId = created?.id ?? presetCalls[presetCalls.length - 1]?.id;
    if (!presetId) return;

    await scheduleEvent({
      type: 'call',
      time,
      presetId,
      profileId: null,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule Call</Text>

      <Text>Delay (minutes, 1–30)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={delay}
        onChangeText={setDelay}
      />

      <Text>Caller name</Text>
      <TextInput
        style={styles.input}
        value={callerName}
        onChangeText={setCallerName}
      />

      <Text>Mode</Text>
      {modes.map(m => (
        <Button
          key={m.value}
          title={`${m.label}${mode === m.value ? ' ✓' : ''}`}
          onPress={() => setMode(m.value)}
        />
      ))}

      <Text>Preset title (optional)</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      {settings && !settings.hasPaidCallFeature && (
        <Text style={styles.locked}>
          Advanced call options locked. Unlock in Settings via PayPal.
        </Text>
      )}

      <Button title="Schedule Call" onPress={handleSchedule} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
  },
  locked: { color: 'red', marginVertical: 8 },
});

export default ScheduleCallScreen;
