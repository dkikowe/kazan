import { FilterGroup } from './types';

export const getFilters = async (): Promise<FilterGroup[]> => {
  try {
    const response = await fetch('/api/filters');
    if (!response.ok) {
      throw new Error('Failed to fetch filters');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching filters:', error);
    return [];
  }
}; 