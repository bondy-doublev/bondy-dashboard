import { api } from 'src/lib/axios';

// Types
export type CreateFaqRequest = {
  question: string;
  answer: string;
};

export type FaqResponse = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
};

type AppApiResponse<T> = {
  code?: number;
  message?: string;
  data: T;
};

export const faqService = {
  // ---------------- CREATE FAQ ----------------
  async create(req: CreateFaqRequest): Promise<FaqResponse | null> {
    try {
      const res = await api.post<AppApiResponse<FaqResponse>>('/chat/faqs', req);
      return res.data.data ?? res.data;
    } catch (error: any) {
      console.error('Create FAQ Error:', error);
      return null;
    }
  },

  // ---------------- GET ALL FAQS ----------------
  async getAll(): Promise<FaqResponse[]> {
    try {
      const res = await api.get<AppApiResponse<FaqResponse[]>>('/chat/faqs');
      return (res.data as any).data ?? res.data ?? [];
    } catch (error: any) {
      console.error('Get All FAQs Error:', error);
      return [];
    }
  },

  // ---------------- DELETE FAQ ----------------
  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`/chat/faqs/${id}`);
      return true;
    } catch (error: any) {
      console.error('Delete FAQ Error:', error);
      return false;
    }
  },
};
