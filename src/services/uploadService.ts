/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from '../lib/axios';
import { AxiosResponse } from 'axios';

const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}/upload`;

export const uploadService = {
  // -------------------- Upload 1 file local --------------------
  async uploadLocal(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response: AxiosResponse = await api.post(`${API_URL}/local`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch {
      throw new Error('Failed to upload file locally');
    }
  },

  // -------------------- Upload nhiều file local --------------------
  async uploadMultipleLocal(files: File[]) {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const response: AxiosResponse = await api.post(`${API_URL}/local/multiple`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch {
      throw new Error('Failed to upload multiple files locally');
    }
  },

  // -------------------- Upload 1 file Cloudinary --------------------
  async uploadCloudinary(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response: AxiosResponse = await api.post(`${API_URL}/cloudinary`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch {
      throw new Error('Failed to upload file to Cloudinary');
    }
  },

  // -------------------- Upload nhiều file Cloudinary --------------------
  async uploadMultipleCloudinary(files: File[]) {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const response: AxiosResponse = await api.post(`${API_URL}/cloudinary/multiple`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch {
      throw new Error('Failed to upload multiple files to Cloudinary');
    }
  },
};
