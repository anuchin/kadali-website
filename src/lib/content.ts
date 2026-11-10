import type { CollectionEntry } from 'astro:content';

const kMonths = ['ಜನವರಿ','ಫೆಬ್ರವರಿ','ಮಾರ್ಚ್','ಏಪ್ರಿಲ್','ಮೇ','ಜೂನ್','ಜುಲೈ','ಆಗಸ್ಟ್','ಸೆಪ್ಟೆಂಬರ್','ಅಕ್ಟೋಬರ್','ನವೆಂಬರ್','ಡಿಸೆಂಬರ್'];
const kDays = ['ಭಾನುವಾರ','ಸೋಮವಾರ','ಮಂಗಳವಾರ','ಬುಧವಾರ','ಗುರುವಾರ','ಶುಕ್ರವಾರ','ಶನಿವಾರ'];

export const fmtDate = (d: Date): string =>
  `${d.getDate()} ${kMonths[d.getMonth()]} ${d.getFullYear()}`;

export const fmtDateTime = (d: Date): string =>
  `${fmtDate(d)}, ${kDays[d.getDay()]}, ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

export type EventStatus = 'upcoming' | 'ongoing' | 'past' | 'cancelled';

export const eventStatus = (
  start: Date, end: Date | undefined, cancelled: boolean
): EventStatus => {
  if (cancelled) return 'cancelled';
  const now = new Date();
  const e = end ?? new Date(start.getTime() + 4 * 3600_000);
  if (now < start) return 'upcoming';
  if (now <= e) return 'ongoing';
  return 'past';
};

export const statusLabel: Record<EventStatus, string> = {
  upcoming: 'ಮುಂಬರುತ್ತದೆ', ongoing: 'ನಡೆಯುತ್ತಿದೆ', past: 'ಮುಗಿದಿದೆ', cancelled: 'ರದ್ದು',
};

export const isActive = (a: CollectionEntry<'announcements'>): boolean => {
  if (!a.data.expiryDate) return true;
  return a.data.expiryDate.getTime() >= Date.now();
};
