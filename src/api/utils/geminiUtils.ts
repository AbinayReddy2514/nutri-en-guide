
import { API_KEY, API_URL } from '../config/geminiConfig';

export async function generateContent(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

export function parseJsonResponse(response: string): any {
  const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                    response.match(/```\n([\s\S]*?)\n```/) || 
                    response.match(/(\{[\s\S]*?\})/);
  
  if (jsonMatch && jsonMatch[1]) {
    return JSON.parse(jsonMatch[1]);
  }
  
  return JSON.parse(response);
}

