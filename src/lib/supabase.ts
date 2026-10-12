export interface UserSession {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

const DEMO_USER: UserSession = {
  id: 'demo-user-123',
  email: 'traveler@tripgenie.ai',
  name: 'Alex Rivera',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

const AUTH_STORAGE_KEY = 'tripgenie_current_user';

export function getCurrentUser(): UserSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return DEMO_USER;
    return JSON.parse(raw);
  } catch {
    return DEMO_USER;
  }
}

export function signInDemoUser(): UserSession {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USER));
  return DEMO_USER;
}

export function signOutUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
