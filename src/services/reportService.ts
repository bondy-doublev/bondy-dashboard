// src/services/reportService.ts
import { api } from '../lib/axios';
import { Report } from '../models/Report';
import { PaginationParams, SortDirection, SortField } from 'src/types/PaginationParams';

const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}/admin/reports`;

export const reportService = {
  async getReports(params: PaginationParams = {}): Promise<Report[]> {
    const {
      page = 0,
      size = 10,
      sortBy = SortField.CREATED_AT,
      direction = SortDirection.DESC,
    } = params;

    const response = await api.get(API_URL, {
      params: {
        page,
        size,
        sortBy,
        direction,
      },
    });

    console.log('reports: ', response);

    // backend: new AppApiResponse(reports.getContent())
    // => data chính là mảng Report
    return response.data.data as Report[];
  },
};
