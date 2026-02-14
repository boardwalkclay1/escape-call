// src/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserSettings,
  PresetText,
  PresetCall,
  Profile,
  ScheduledEvent,
} from './types';

const KEYS = {
  SETTINGS: 'settings',
  PRESET_TEXTS: 'preset_texts',
  PRESET_CALLS: 'preset_calls',
  PROFILES: 'profiles',
  EVENTS: 'events',
};

async function getJSON<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function setJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadSettings(): Promise<UserSettings> {
  return getJSON<UserSettings>(KEYS.SETTINGS, {
    id: 'default',
    hasPaidCallFeature: false,
    defaultQuickRingProfileId: null,
    defaultQuickTextProfileId: null,
    hideDeathPresets: false,
    seriousModesOnly: false,
  });
}

export async function saveSettings(settings: UserSettings) {
  return setJSON(KEYS.SETTINGS, settings);
}

export async function loadPresetTexts(): Promise<PresetText[]> {
  return getJSON<PresetText[]>(KEYS.PRESET_TEXTS, []);
}

export async function savePresetTexts(presets: PresetText[]) {
  return setJSON(KEYS.PRESET_TEXTS, presets);
}

export async function loadPresetCalls(): Promise<PresetCall[]> {
  return getJSON<PresetCall[]>(KEYS.PRESET_CALLS, []);
}

export async function savePresetCalls(presets: PresetCall[]) {
  return setJSON(KEYS.PRESET_CALLS, presets);
}

export async function loadProfiles(): Promise<Profile[]> {
  return getJSON<Profile[]>(KEYS.PROFILES, []);
}

export async function saveProfiles(profiles: Profile[]) {
  return setJSON(KEYS.PROFILES, profiles);
}

export async function loadEvents(): Promise<ScheduledEvent[]> {
  return getJSON<ScheduledEvent[]>(KEYS.EVENTS, []);
}

export async function saveEvents(events: ScheduledEvent[]) {
  return setJSON(KEYS.EVENTS, events);
}
