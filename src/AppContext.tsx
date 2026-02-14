// src/AppContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  UserSettings,
  PresetText,
  PresetCall,
  Profile,
  ScheduledEvent,
} from './types';
import {
  loadSettings,
  saveSettings,
  loadPresetTexts,
  savePresetTexts,
  loadPresetCalls,
  savePresetCalls,
  loadProfiles,
  saveProfiles,
  loadEvents,
  saveEvents,
} from './storage';
import { scheduleEventNotification, cancelEventNotification } from './notifications';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  settings: UserSettings | null;
  presetTexts: PresetText[];
  presetCalls: PresetCall[];
  profiles: Profile[];
  events: ScheduledEvent[];
  loading: boolean;

  updateSettings: (partial: Partial<UserSettings>) => Promise<void>;
  addOrUpdateTextPreset: (preset: Partial<PresetText> & { id?: string }) => Promise<void>;
  addOrUpdateCallPreset: (preset: Partial<PresetCall> & { id?: string }) => Promise<void>;
  addOrUpdateProfile: (profile: Partial<Profile> & { id?: string }) => Promise<void>;
  deleteTextPreset: (id: string) => Promise<void>;
  deleteCallPreset: (id: string) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;

  scheduleEvent: (event: Omit<ScheduledEvent, 'id' | 'status'>) => Promise<void>;
  cancelEvent: (id: string) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [presetTexts, setPresetTexts] = useState<PresetText[]>([]);
  const [presetCalls, setPresetCalls] = useState<PresetCall[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, t, c, p, e] = await Promise.all([
        loadSettings(),
        loadPresetTexts(),
        loadPresetCalls(),
        loadProfiles(),
        loadEvents(),
      ]);
      setSettings(s);
      setPresetTexts(t);
      setPresetCalls(c);
      setProfiles(p);
      setEvents(e);
      setLoading(false);
    })();
  }, []);

  const persistSettings = async (next: UserSettings) => {
    setSettings(next);
    await saveSettings(next);
  };

  const updateSettings = async (partial: Partial<UserSettings>) => {
    if (!settings) return;
    const next = { ...settings, ...partial };
    await persistSettings(next);
  };

  const addOrUpdateTextPreset = async (preset: Partial<PresetText> & { id?: string }) => {
    const id = preset.id ?? uuidv4();
    const next: PresetText = {
      id,
      title: preset.title ?? 'Untitled',
      mode: preset.mode ?? 'custom',
      messageText: preset.messageText ?? '',
      isDefault: preset.isDefault ?? false,
    };
    const list = [...presetTexts.filter(p => p.id !== id), next];
    setPresetTexts(list);
    await savePresetTexts(list);
  };

  const addOrUpdateCallPreset = async (preset: Partial<PresetCall> & { id?: string }) => {
    const id = preset.id ?? uuidv4();
    const next: PresetCall = {
      id,
      title: preset.title ?? 'Untitled',
      callerName: preset.callerName ?? 'Unknown',
      mode: preset.mode ?? 'custom',
      defaultDelayMinutes: preset.defaultDelayMinutes ?? 10,
      voiceId: preset.voiceId ?? null,
      isDefault: preset.isDefault ?? false,
    };
    const list = [...presetCalls.filter(p => p.id !== id), next];
    setPresetCalls(list);
    await savePresetCalls(list);
  };

  const addOrUpdateProfile = async (profile: Partial<Profile> & { id?: string }) => {
    const id = profile.id ?? uuidv4();
    const next: Profile = {
      id,
      name: profile.name ?? 'Untitled',
      callPresetId: profile.callPresetId ?? null,
      textPresetId: profile.textPresetId ?? null,
      defaultCallDelayMinutes: profile.defaultCallDelayMinutes ?? null,
      defaultTextDelayMinutes: profile.defaultTextDelayMinutes ?? null,
    };
    const list = [...profiles.filter(p => p.id !== id), next];
    setProfiles(list);
    await saveProfiles(list);
  };

  const deleteTextPreset = async (id: string) => {
    const list = presetTexts.filter(p => p.id !== id);
    setPresetTexts(list);
    await savePresetTexts(list);
  };

  const deleteCallPreset = async (id: string) => {
    const list = presetCalls.filter(p => p.id !== id);
    setPresetCalls(list);
    await savePresetCalls(list);
  };

  const deleteProfile = async (id: string) => {
    const list = profiles.filter(p => p.id !== id);
    setProfiles(list);
    await saveProfiles(list);
  };

  const scheduleEvent = async (event: Omit<ScheduledEvent, 'id' | 'status'>) => {
    const id = uuidv4();
    const next: ScheduledEvent = {
      ...event,
      id,
      status: 'pending',
    };
    const list = [...events, next];
    setEvents(list);
    await saveEvents(list);
    await scheduleEventNotification(next);
  };

  const cancelEvent = async (id: string) => {
    const list = events.map(e =>
      e.id === id ? { ...e, status: 'cancelled' } : e,
    );
    setEvents(list);
    await saveEvents(list);
    await cancelEventNotification(id);
  };

  const value: AppState = {
    settings,
    presetTexts,
    presetCalls,
    profiles,
    events,
    loading,
    updateSettings,
    addOrUpdateTextPreset,
    addOrUpdateCallPreset,
    addOrUpdateProfile,
    deleteTextPreset,
    deleteCallPreset,
    deleteProfile,
    scheduleEvent,
    cancelEvent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
