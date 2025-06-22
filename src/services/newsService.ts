import axios from 'axios';
import { config } from '../config/env';

export interface NewsUpdate {
  id: string;
  title: string;
  summary: string;
  timestamp: number;
  sources: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

class NewsService {
  private readonly PERPLEXITY_API_BASE_URL = 'https://api.perplexity.ai';  async generateNewsUpdate(): Promise<NewsUpdate> {
    try {
      const prompt = `create a captivating and "spicy" so to speak 150 word update on the latest world news pertaining to the development of world war 3. what is the current world state when it comes to world war 3 and what are some expert suggestions about what happened most recently and what may be still to come. feel free to be ominous and vague to some extent but make sure everything you say is factual. make the first sentence of the story super interesting so the reader wants to read more, especially the first part of the first sentence.`;

      if (!config.perplexity.apiKey) {
        console.error('Perplexity API key not configured');
        throw new Error('News service not configured - API key required');
      }

      const response = await axios.post(
        `${this.PERPLEXITY_API_BASE_URL}/chat/completions`,
        {
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a military intelligence analyst specializing in global conflict assessment. Write engaging, urgent summaries about world tensions and WW3 risk factors based on the latest real-time information.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.8,
          top_p: 0.9,
          return_citations: true,
          search_domain_filter: ["bbc.com", "reuters.com", "apnews.com", "cnn.com", "theguardian.com", "wsj.com", "ft.com", "nytimes.com", "washingtonpost.com", "politico.com"],
          return_images: false,
          return_related_questions: false,
          search_recency_filter: "day",
          top_k: 0,
          stream: false,
          presence_penalty: 0,
          frequency_penalty: 1
        },
        {
          headers: {
            'Authorization': `Bearer ${config.perplexity.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0]?.message?.content || '';
      const citations = response.data.citations || [];
      
      // Extract sources from citations
      const sources = citations.map((citation: string) => {
        try {
          const url = new URL(citation);
          return url.hostname.replace('www.', '');
        } catch {
          return citation;
        }
      }).slice(0, 5);

      const urgencyLevel = this.determineUrgencyLevel(content);

      return {
        id: `update_${Date.now()}`,
        title: this.extractTitle(content),
        summary: content,
        timestamp: Date.now(),
        sources: sources.length > 0 ? sources : ['Perplexity AI', 'Multiple News Sources'],
        urgencyLevel
      };    } catch (error) {
      console.error('Error generating news update:', error);
      throw new Error('Failed to fetch news update');
    }
  }

  private extractTitle(content: string): string {
    // Extract first sentence or first 50 characters as title
    const firstSentence = content.split('.')[0];
    if (firstSentence.length > 60) {
      return firstSentence.substring(0, 57) + '...';
    }
    return firstSentence || 'Global Tensions Update';
  }
  private determineUrgencyLevel(summary: string): 'low' | 'medium' | 'high' | 'critical' {
    const urgentKeywords = {
      critical: ['nuclear strike', 'war declared', 'nato article 5', 'invasion', 'missile launch', 'emergency protocols'],
      high: ['military buildup', 'conflict escalation', 'defense alert', 'crisis level', 'cyber attack', 'sanctions war'],
      medium: ['diplomatic tension', 'military exercise', 'trade war', 'arms buildup', 'alliance strain', 'security concern'],
      low: ['diplomatic talks', 'peace initiative', 'cooperation', 'stability', 'negotiations', 'agreement']
    };

    const lowerSummary = summary.toLowerCase();

    for (const [level, keywords] of Object.entries(urgentKeywords)) {
      if (keywords.some(keyword => lowerSummary.includes(keyword))) {
        return level as 'low' | 'medium' | 'high' | 'critical';
      }
    }

    // Default to medium for spicy content
    return 'medium';
  }  // Utility method to get just the first line for non-subscribers
  getPreviewText(summary: string): string {
    const sentences = summary.split('.');
    if (sentences.length === 0) return '';
    
    // Get the first sentence and trim it
    const firstSentence = sentences[0].trim();
    
    // If it's very long, take approximately first 40-50 characters and break at word boundary
    if (firstSentence.length > 50) {
      const words = firstSentence.split(' ');
      let preview = '';
      for (const word of words) {
        if ((preview + ' ' + word).length > 50) break;
        preview += (preview ? ' ' : '') + word;
      }
      return preview + '...';
    }
    
    return firstSentence + '...';
  }

  // Get the remaining text after the preview
  getRemainingText(summary: string): string {
    const preview = this.getPreviewText(summary);
    const previewWithoutEllipsis = preview.replace('...', '');
    const remainingStart = summary.indexOf(previewWithoutEllipsis) + previewWithoutEllipsis.length;
    return summary.substring(remainingStart);
  }
}

export const newsService = new NewsService();
