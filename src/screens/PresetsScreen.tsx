// src/screens/PresetsScreen.tsx

import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../AppContext';

const PresetsScreen: React.FC = () => {
  const {
    presetTexts,
    presetCalls,
    deleteTextPreset,
    deleteCallPreset,
  } = useApp();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Text Presets</Text>
      {presetTexts.map(p => (
        <View key={p.id} style={styles.item}>
          <Text style={styles.itemTitle}>{p.title}</Text>
          <Text numberOfLines={2}>{p.messageText}</Text>
          <Button title="Delete" onPress={() => deleteTextPreset(p.id)} />
        </View>
      ))}

      <Text style={styles.title}>Call Presets</Text>
      {presetCalls.map(p => (
        <View key={p.id} style={styles.item}>
          <Text style={styles.itemTitle}>{p.title}</Text>
          <Text>{p.callerName}</Text>
          <Button title="Delete" onPress={() => deleteCallPreset(p.id)} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 12 },
  item: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 8,
  },
  itemTitle: { fontWeight: '600' },
});

export default PresetsScreen;
