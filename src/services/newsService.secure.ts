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
  // Secure implementation - calls our server-side API endpoint
  async generateNewsUpdate(): Promise<NewsUpdate> {
    try {
      // Call our secure server-side API endpoint instead of direct Perplexity API
      const response = await axios.post('/api/news/generate');

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const newsData = response.data;
      
      return {
        id: `news-${Date.now()}`,
        title: this.extractTitle(newsData.content),
        summary: newsData.content,
        timestamp: Date.now(),
        sources: newsData.citations || ['Perplexity AI', 'Multiple News Sources'],
        urgencyLevel: this.assessUrgencyLevel(newsData.content)
      };
    } catch (error) {
      console.error('Error fetching news update:', error);
      throw new Error('Failed to fetch news update');
    }
  }

  private extractTitle(content: string): string {
    // Extract first sentence as title
    const sentences = content.split(/[.!?]/);
    const firstSentence = sentences[0]?.trim();
    
    if (firstSentence && firstSentence.length > 10) {
      return firstSentence.length > 80 
        ? firstSentence.substring(0, 80) + '...'
        : firstSentence;
    }
    
    return 'Latest World War 3 Intelligence Update';
  }

  private assessUrgencyLevel(content: string): 'low' | 'medium' | 'high' | 'critical' {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('imminent') || 
        lowerContent.includes('critical') || 
        lowerContent.includes('emergency') ||
        lowerContent.includes('breaking')) {
      return 'critical';
    }
    
    if (lowerContent.includes('urgent') || 
        lowerContent.includes('escalating') || 
        lowerContent.includes('tensions rising')) {
      return 'high';
    }
    
    if (lowerContent.includes('developing') || 
        lowerContent.includes('monitoring') ||
        lowerContent.includes('concern')) {
      return 'medium';
    }
    
    return 'low';
  }

  // Backup method for offline/testing
  async getFallbackNews(): Promise<NewsUpdate> {
    return {
      id: `fallback-${Date.now()}`,
      title: 'Global Tensions Monitor Update',
      summary: 'Intelligence services continue monitoring global security developments. Current threat assessment indicates ongoing surveillance of international conflicts and diplomatic tensions. Updates will be provided as new intelligence becomes available.',
      timestamp: Date.now(),
      sources: ['Intelligence Network', 'Global Security Monitor'],
      urgencyLevel: 'medium'
    };
  }
}

export const newsService = new NewsService();
