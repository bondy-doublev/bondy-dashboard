/* eslint-disable @typescript-eslint/no-unused-vars */
import { AdvertRequestStatus } from 'src/enums';
import { api } from '../lib/axios';
import { AxiosResponse } from 'axios';

/**
 * Base URL
 */
const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}/advert`;

export const advertService = {
  /* =====================================================
   * USER
   * ===================================================== */

  // ➕ User tạo request quảng cáo
  async create(data: {
    userId: number;
    userAvatar?: string;
    accountName: string;
    title: string;
    postId?: number;
    startDate: string;
    endDate: string;
    media: {
      url: string;
      type: 'IMAGE' | 'VIDEO';
    }[];
  }) {
    try {
      const response: AxiosResponse = await api.post(API_URL, data);
      return response.data;
    } catch {
      throw new Error('Failed to create advert');
    }
  },

  // 👤 User lấy danh sách quảng cáo của mình
  async getMyRequests(userId: number) {
    try {
      const response: AxiosResponse = await api.get(`${API_URL}/me`, { params: { userId } });
      return response.data;
    } catch {
      throw new Error('Failed to fetch my adverts');
    }
  },

  /* =====================================================
   * ADMIN
   * ===================================================== */

  /**
   * 📊 Admin lấy danh sách quảng cáo
   * - filter theo status
   * - pagination
   *
   * Backend: GET /advert/admin
   */
  async getAllForAdmin(params?: { status?: AdvertRequestStatus; page?: number; limit?: number }) {
    try {
      const response: AxiosResponse = await api.get(`${API_URL}/admin`, { params });
      return response.data;
    } catch {
      throw new Error('Failed to fetch adverts for admin');
    }
  },

  /**
   * 🔄 Admin cập nhật trạng thái quảng cáo
   * Backend: PATCH /advert/:id/status
   */
  async updateStatus(advertId: number, status: AdvertRequestStatus) {
    try {
      const response: AxiosResponse = await api.patch(`${API_URL}/${advertId}/status`, { status });
      return response.data;
    } catch {
      throw new Error('Failed to update advert status');
    }
  },

  /* =====================================================
   * PUBLIC / ADS SYSTEM
   * ===================================================== */

  /**
   * 📢 Lấy danh sách quảng cáo đang chạy để render ngoài web
   * Backend: GET /advert/active
   */
  async getActiveAdverts() {
    try {
      const response: AxiosResponse = await api.get(`${API_URL}/active`);
      return response.data;
    } catch {
      throw new Error('Failed to fetch active adverts');
    }
  },
};
