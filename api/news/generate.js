export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Your original "spicy" prompt
    const prompt = `create a captivating and "spicy" so to speak 150 word update on the latest world news pertaining to the development of world war 3. what is the current world state when it comes to world war 3 and what are some expert suggestions about what happened most recently and what may be still to come. feel free to be ominous and vague to some extent but make sure everything you say is factual. make the first sentence of the story super interesting so the reader wants to read more, especially the first part of the first sentence. Place special emphasis on Donald Trump and the conflict with Iran or whatever else is happening prominently surrounding terrorizing weaponry. Focus mainly on one specific update with each post and try to keep it interesting`;

    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!perplexityApiKey) {
      return res.status(500).json({ error: 'Perplexity API key not configured' });
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
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
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'Perplexity API error' });
    }

    const content = data.choices[0]?.message?.content;
    const citations = data.citations || [];

    if (!content) {
      return res.status(500).json({ error: 'No content received from Perplexity API' });
    }

    return res.status(200).json({
      content,
      citations
    });

  } catch (error) {
    console.error('Error calling Perplexity API:', error);
    return res.status(500).json({ error: 'Failed to generate news update' });
  }
}
