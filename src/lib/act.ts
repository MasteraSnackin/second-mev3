export interface IntentClassificationResult {
  code: number;
  data: {
    hiring?: number;
    collaboration?: number;
    learning?: number;
    business?: number;
  };
}

/**
 * Classify user intent using SecondMe Act API
 */
export async function classifyIntent(
  text: string,
  accessToken: string
): Promise<IntentClassificationResult> {
  const response = await fetch(`${process.env.SECONDME_API_BASE_URL}/api/act`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      categories: ['hiring', 'collaboration', 'learning', 'business'],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to classify intent');
  }

  return response.json();
}
