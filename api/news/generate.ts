import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

interface NewsUpdate {
  id: string;
  title: string;
  summary: string;
  timestamp: number;
  sources: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      console.error('Perplexity API key not configured');
      return res.status(500).json({ error: 'News service not configured' });
    }

    const prompt = `create a captivating and "spicy" so to speak 150 word update on the latest world news pertaining to the development of world war 3. what is the current world state when it comes to world war 3 and what are some expert suggestions about what happened most recently and what may be still to come. feel free to be ominous and vague to some extent but make sure everything you say is factual. make the first sentence of the story super interesting so the reader wants to read more, especially the first part of the first sentence.`;

    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a geopolitical intelligence analyst providing factual, well-sourced updates on global tensions and conflicts. Focus on verified information from credible sources.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from Perplexity API');
    }

    // Create a structured news update
    const newsUpdate: NewsUpdate = {
      id: `update-${Date.now()}`,
      title: 'Latest World War 3 Intelligence Update',
      summary: content,
      timestamp: Date.now(),
      sources: ['Perplexity AI Intelligence Analysis'],
      urgencyLevel: 'high'
    };

    res.status(200).json(newsUpdate);

  } catch (error: any) {
    console.error('Error generating news update:', error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    res.status(500).json({ 
      error: 'Failed to fetch news update',
      details: error.message 
    });
  }
}
