import axios from 'axios';

export interface NewsUpdate {
  id: string;
  title: string;
  summary: string;
  timestamp: number;
  sources: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

class NewsService {
  async generateNewsUpdate(): Promise<NewsUpdate> {
    try {
      // Call our secure API endpoint instead of Perplexity directly
      const response = await axios.post('/api/news/generate', {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;

    } catch (error: any) {
      console.error('Error fetching update:', error.response?.data || error.message);
      throw new Error('Failed to fetch news update');
    }
  }

  async getCachedUpdate(): Promise<NewsUpdate | null> {
    try {
      // This could be expanded to check a cache endpoint
      // For now, just return null to force fresh generation
      return null;
    } catch (error) {
      console.error('Error fetching cached update:', error);
      return null;
    }
  }

  // Check if an update should be refreshed based on timestamp
  shouldRefreshUpdate(update: NewsUpdate, maxAgeHours: number = 1): boolean {
    const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert to milliseconds
    return Date.now() - update.timestamp > maxAge;
  }

  // Format update for display
  formatUpdateForDisplay(update: NewsUpdate): string {
    return `${update.summary}\n\nSources: ${update.sources.join(', ')}\nUrgency: ${update.urgencyLevel.toUpperCase()}`;
  }

  // Validate update structure
  isValidUpdate(update: any): update is NewsUpdate {
    return (
      update &&
      typeof update.id === 'string' &&
      typeof update.title === 'string' &&
      typeof update.summary === 'string' &&
      typeof update.timestamp === 'number' &&
      Array.isArray(update.sources) &&
      ['low', 'medium', 'high', 'critical'].includes(update.urgencyLevel)
    );
  }
}

export const newsService = new NewsService();
