// src/notifications.ts

import { ScheduledEvent } from './types';

// Stub IDs mapping event.id -> notificationId if needed
// For now, just define the interface.

export async function scheduleEventNotification(event: ScheduledEvent) {
  // TODO: integrate with platform local notifications.
  // - If event.type === 'call': schedule to open FakeCall screen
  // - If event.type === 'text': schedule text-style notification
  console.log('Scheduling notification for event', event);
}

export async function cancelEventNotification(eventId: string) {
  // TODO: cancel notification by stored notificationId
  console.log('Cancel notification for event', eventId);
}
