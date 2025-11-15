// src/services/analyticsDataService.ts
import api from './api';

export const getAnalyticsData = async (daysAgo: number = 7) => {
  try {
    const { data } = await api.get(`/analytics/stats?days=${daysAgo}`);
    return data.data;
  } catch (error) {
    console.error('Error obteniendo datos de analytics:', error);
    throw error;
  }
};