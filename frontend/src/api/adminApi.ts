import { api } from './client';

export interface PlatformStats {
  totalEvents: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  totalTicketsSold: number;
  totalCheckedIn: number;
}

export interface UserAdminDto {
  userId: number;
  name: string;
  email: string;
  role: string;
}

export const adminApi = {
  getStats: () => api.get<PlatformStats>('/api/admin/stats'),
  getUsers: () => api.get<UserAdminDto[]>('/api/admin/users'),
  changeRole: (userId: number, newRole: string) =>
    api.post<void>(`/api/admin/users/${userId}/role`, { newRole }),
};
