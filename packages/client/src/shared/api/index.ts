// TODO: env 파일로 관리하기
const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api` || 'http://localhost:3000/api';

interface FetchOptions extends Omit<RequestInit, 'body'> {
  headers?: Record<string, string>;
  body?: unknown;
}

export const apiClient = {
  get: (endPoint: string, options: FetchOptions = {}) =>
    sendRequest(endPoint, { ...options, method: 'GET' }),
  post: (endPoint: string, options: FetchOptions = {}) =>
    sendRequest(endPoint, { ...options, method: 'POST' }),
  put: (endPoint: string, options: FetchOptions = {}) =>
    sendRequest(endPoint, { ...options, method: 'PUT' }),
  delete: (endPoint: string, options: FetchOptions = {}) =>
    sendRequest(endPoint, { ...options, method: 'DELETE' }),
};

async function sendRequest(endPoint: string, options: FetchOptions = {}, timeout: number = 10000) {
  const { headers, body, ...restOptions } = options;

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
      // axios처럼 객체를 body로 받을 수 있도록 설정
      ...(body !== undefined &&
        body !== null && {
          body: typeof body === 'object' ? JSON.stringify(body) : (body as BodyInit),
        }),
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
