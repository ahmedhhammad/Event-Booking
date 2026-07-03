import { api } from './client';

export interface UserInfo {
  userId: number;
  name: string;
  email: string;
  role: 'Attendee' | 'Organizer' | 'Admin';
}

export const authApi = {
  me: () => api.get<UserInfo>('/api/auth/me'),

  login: (email: string, password: string) =>
    api.post<UserInfo>('/api/auth/login', { email, password }),

  register: (name: string, email: string, password: string, role: string) =>
    api.post<UserInfo>('/api/auth/register', { name, email, password, role }),

  logout: () => api.post<void>('/api/auth/logout', {}),
};
