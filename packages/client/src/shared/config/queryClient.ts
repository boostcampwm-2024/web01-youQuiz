import { QueryClient } from '@tanstack/react-query';

// 조회(read) 전용 재시도 정책. 상태 변경 이벤트는 Query를 거치지 않아 대상 아님.
export const QUERY_RETRY_COUNT = 1;
export const QUERY_RETRY_DELAY_MS = 500;

export const createAppQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: QUERY_RETRY_COUNT,
        retryDelay: QUERY_RETRY_DELAY_MS,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 10,
      },
    },
  });
