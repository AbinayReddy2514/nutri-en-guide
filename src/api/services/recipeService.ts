
import { generateContent } from '../utils/geminiUtils';

export async function getRecipe(mealName: string): Promise<string[]> {
  const prompt = `
    Please provide detailed preparation steps for the Indian dish "${mealName}".
    Format as a numbered list of steps, each step should be clear and concise.
    Return ONLY the numbered steps, no introduction or additional text.
  `;

  try {
    const response = await generateContent(prompt);
    return response
      .split('\n')
      .filter(step => step.trim().length > 0)
      .map(step => step.replace(/^\d+\.\s*/, '').trim());
  } catch (error) {
    console.error('Error getting recipe:', error);
    return ['Recipe steps could not be generated. Please try again later.'];
  }
}

