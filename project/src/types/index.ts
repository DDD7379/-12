export interface Language {
  code: 'en' | 'he';
  name: string;
  direction: 'ltr' | 'rtl';
}

export interface Member {
  id: string;
  discordHandle: string;
  robloxUsername: string;
  robloxProfileLink: string;
  age: number;
  country: string;
  timezone: string;
  email: string;
  languages: string;
  motivation: string;
  scenario1: string;
  scenario2: string;
  weeklyAvailability: string;
  acceptedConduct: boolean;
  guardianConsent?: boolean;
  projectLinks?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  publishDate: string;
  author: string;
  tags: string[];
  language: 'he' | 'en';
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface MythFact {
  id: string;
  myth: string;
  fact: string;
  language: 'he' | 'en';
}

export interface Subscription {
  id: string;
  email: string;
  type: 'email' | 'discord';
  createdAt: string;
}

export const DISCORD_INVITE_URL = 'https://discord.gg/wcEQdzzf';