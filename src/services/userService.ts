/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from '../lib/axios';
import { AxiosResponse } from 'axios';

const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}/users`;

export const userService = {
  async getAll(email?: string) {
    try {
      const response: AxiosResponse = await api.get(`${API_URL}`, {
        params: email ? { email } : {},
      });
      return response.data;
    } catch {
      throw new Error('Failed to fetch users');
    }
  },

  // Nếu backend có pagination sau này thì dùng hàm này
  async getUsers(email?: string, page = 1, limit = 10) {
    try {
      const params: Record<string, any> = { page, limit };
      if (email) params.email = email;

      const response: AxiosResponse = await api.get(`${API_URL}`, { params });
      return response.data;
    } catch {
      throw new Error('Failed to fetch users');
    }
  },

  async getProfile() {
    try {
      const response: AxiosResponse = await api.get(`${API_URL}/profile`);
      return response.data;
    } catch {
      throw new Error('Failed to fetch profile');
    }
  },

  async updateProfile(data: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    dob?: string;
    gender?: boolean;
  }) {
    try {
      const response: AxiosResponse = await api.put(`${API_URL}`, data);
      return response.data;
    } catch {
      throw new Error('Failed to update profile');
    }
  },

  async updateAvatar(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response: AxiosResponse = await api.put(`${API_URL}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch {
      throw new Error('Failed to update avatar');
    }
  },

  // 🔧 khớp với backend: PUT /users/{id}
  async editUser(
    userId: number,
    data: {
      firstName?: string;
      middleName?: string;
      lastName?: string;
      dob?: string;
      gender?: boolean;
      avatarUrl?: string;
    }
  ) {
    try {
      const response: AxiosResponse = await api.put(`${API_URL}/${userId}`, data);
      return response.data;
    } catch {
      throw new Error('Failed to edit user');
    }
  },

  // 🔧 khớp với backend: PUT /users/{id}/toggle-status
  async toggleActiveUser(userId: number) {
    try {
      const response: AxiosResponse = await api.put(`${API_URL}/${userId}/toggle-status`);
      return response.data;
    } catch {
      throw new Error('Failed to toggle user status');
    }
  },

  async deleteUser(userId: number) {
    try {
      const response: AxiosResponse = await api.delete(`${API_URL}/${userId}`);
      return response.data;
    } catch {
      throw new Error('Failed to delete user');
    }
  },
};
