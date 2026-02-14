// src/types.ts

export type Mode =
  | 'urgent'
  | 'family_death'
  | 'hospital'
  | 'work'
  | 'custom';

export type ScheduledEventType = 'call' | 'text';

export type ScheduledEventStatus = 'pending' | 'sent' | 'cancelled';

export interface UserSettings {
  id: string;
  hasPaidCallFeature: boolean;
  defaultQuickRingProfileId: string | null;
  defaultQuickTextProfileId: string | null;
  hideDeathPresets: boolean;
  seriousModesOnly: boolean;
}

export interface PresetText {
  id: string;
  title: string;
  mode: Mode;
  messageText: string;
  isDefault: boolean;
}

export interface PresetCall {
  id: string;
  title: string;
  callerName: string;
  mode: Mode;
  defaultDelayMinutes: number;
  voiceId?: string | null;
  isDefault: boolean;
}

export interface Profile {
  id: string;
  name: string;
  callPresetId: string | null;
  textPresetId: string | null;
  defaultCallDelayMinutes: number | null;
  defaultTextDelayMinutes: number | null;
}

export interface ScheduledEvent {
  id: string;
  type: ScheduledEventType;
  time: string; // ISO string
  presetId: string;
  profileId?: string | null;
  status: ScheduledEventStatus;
}
