
import { HasuraActionResponse } from '@/types/news';

// Hasura GraphQL endpoint
const HASURA_ENDPOINT = 'https://your-hasura-endpoint/v1/graphql';

/**
 * Execute a GraphQL query or mutation against Hasura
 * @param query GraphQL query or mutation string
 * @param variables Variables for the query
 * @param token Authentication token (optional)
 * @returns Promise with the query response
 */
export const executeGraphqlQuery = async <T>(
  query: string, 
  variables: Record<string, any> = {}, 
  token?: string
): Promise<HasuraActionResponse<T>> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add authentication header if token is provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(HASURA_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((e: any) => e.message).join(', '));
    }

    return result;
  } catch (error) {
    console.error('GraphQL query execution failed:', error);
    throw error;
  }
};
