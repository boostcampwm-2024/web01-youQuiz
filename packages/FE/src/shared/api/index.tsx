const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  body?: string;
}

async function apiClient(endPoint: string, options: FetchOptions = {}, timeout: number = 5000) {
  const { headers, ...restOptions } = options;

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort();
  }, timeout);

  try {
    const response = await fetch(`${BASE_URL}${endPoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        ...headers,
      },
      signal: abortController.signal,
      ...restOptions,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'API 요청 실패');
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export default apiClient;
