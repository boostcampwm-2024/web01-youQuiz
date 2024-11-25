const BASE_URL = import.meta.env.VITE_SERVER_URL
  ? `${import.meta.env.VITE_SERVER_URL}/api`
  : 'http://localhost:3000/api';

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
        // TODO: 추후 로그인 로직 추가 시 사용
        // Authorization: `Bearer ${localStorage.getItem('token')}`,
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
      const errorMessage = await parseResponseText(response);
      throw new Error(errorMessage || 'API 요청 실패');
    }
    return parseResponse(response);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return {};
    }
  } else if (contentType.includes('text')) {
    return await response.text();
  } else {
    return null;
  }
}

// 에러 메시지 안전하게 처리
async function parseResponseText(response: Response) {
  try {
    return await response.text();
  } catch {
    return '서버로부터 응답을 받지 못했습니다.';
  }
}
