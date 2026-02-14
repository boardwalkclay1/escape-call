// src/screens/SettingsScreen.tsx

import React from 'react';
import { View, Text, Button, StyleSheet, Linking } from 'react-native';
import { useApp } from '../AppContext';

const PAYPAL_LINK = 'https://your-paypal-link-here.com'; // replace

const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, profiles } = useApp();

  if (!settings) return null;

  const toggle = (key: 'hideDeathPresets' | 'seriousModesOnly') => {
    updateSettings({ [key]: !settings[key] } as any);
  };

  const setDefaultProfile = (type: 'call' | 'text', id: string | null) => {
    if (type === 'call') {
      updateSettings({ defaultQuickRingProfileId: id });
    } else {
      updateSettings({ defaultQuickTextProfileId: id });
    }
  };

  const handlePayPal = async () => {
    await Linking.openURL(PAYPAL_LINK);
    // After successful payment, you would set hasPaidCallFeature = true
    // via backend callback or manual toggle for now:
    // updateSettings({ hasPaidCallFeature: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.sectionTitle}>Payment</Text>
      <Text>
        Call feature: {settings.hasPaidCallFeature ? 'Unlocked' : 'Locked'}
      </Text>
      {!settings.hasPaidCallFeature && (
        <Button title="Unlock via PayPal" onPress={handlePayPal} />
      )}

      <Text style={styles.sectionTitle}>Modes visibility</Text>
      <Button
        title={`Hide death-related presets: ${
          settings.hideDeathPresets ? 'ON' : 'OFF'
        }`}
        onPress={() => toggle('hideDeathPresets')}
      />
      <Button
        title={`Serious modes only: ${
          settings.seriousModesOnly ? 'ON' : 'OFF'
        }`}
        onPress={() => toggle('seriousModesOnly')}
      />

      <Text style={styles.sectionTitle}>Default profiles</Text>
      <Text>Quick Ring profile</Text>
      {profiles.map(p => (
        <Button
          key={p.id}
          title={`${p.name}${
            settings.defaultQuickRingProfileId === p.id ? ' ✓' : ''
          }`}
          onPress={() => setDefaultProfile('call', p.id)}
        />
      ))}

      <Text>Quick Text profile</Text>
      {profiles.map(p => (
        <Button
          key={p.id}
          title={`${p.name}${
            settings.defaultQuickTextProfileId === p.id ? ' ✓' : ''
          }`}
          onPress={() => setDefaultProfile('text', p.id)}
        />
      ))}

      <Text style={styles.sectionTitle}>Legal</Text>
      <Text>For entertainment only. Do not use to deceive in harmful ways.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 16 },
});

export default SettingsScreen;
