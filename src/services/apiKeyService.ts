/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from '../lib/axios';
import { AxiosResponse } from 'axios';

const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}/auth/api-key`;

export const apiKeyService = {
  // 🔑 Lấy danh sách tất cả API Key
  async getAll() {
    try {
      const response: AxiosResponse = await api.get(`${API_URL}/list`);
      return response.data;
    } catch {
      throw new Error('Failed to fetch API keys');
    }
  },

  // ➕ Tạo API Key mới
  async create(data: { name: string; rawKey: string; prefix?: string; expiresAt?: string }) {
    try {
      const response: AxiosResponse = await api.post(`${API_URL}/create`, data);
      return response.data;
    } catch {
      throw new Error('Failed to create API key');
    }
  },

  // ✏️ Cập nhật API Key
  async update(
    id: number,
    data: {
      name?: string;
      expiresAt?: string;
      active?: boolean;
    }
  ) {
    try {
      const response: AxiosResponse = await api.put(`${API_URL}/update/${id}`, data);
      return response.data;
    } catch {
      throw new Error('Failed to update API key');
    }
  },

  // ❌ Xóa API Key
  async delete(id: number) {
    try {
      const response: AxiosResponse = await api.delete(`${API_URL}/delete/${id}`);
      return response.data;
    } catch {
      throw new Error('Failed to delete API key');
    }
  },

  // ✅ Kiểm tra API Key có hợp lệ không
  async check(apiKey: string) {
    try {
      const response: AxiosResponse = await api.post(`${API_URL}/check`, { apiKey });
      return response.data; // true hoặc false
    } catch {
      throw new Error('Failed to validate API key');
    }
  },
};
