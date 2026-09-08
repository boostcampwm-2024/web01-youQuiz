import { execSync } from 'node:child_process';

export const REDIS_HOST = process.env.E2E_REDIS_HOST || '192.168.64.6';
export const REDIS_PORT = process.env.E2E_REDIS_PORT || '6379';
export const REDIS_DB = process.env.E2E_REDIS_DB || '1';

export function redisGet(key: string): string {
  return execSync(`redis-cli -h ${REDIS_HOST} -p ${REDIS_PORT} -n ${REDIS_DB} GET "${key}"`)
    .toString()
    .trim();
}

export function redisGetJSON<T>(key: string): T | undefined {
  const raw = redisGet(key);
  if (!raw) return undefined;
  return JSON.parse(raw) as T;
}

export function redisDel(keys: string[]): void {
  if (keys.length === 0) return;
  const quoted = keys.map((k) => `"${k}"`).join(' ');
  execSync(`redis-cli -h ${REDIS_HOST} -p ${REDIS_PORT} -n ${REDIS_DB} DEL ${quoted}`);
}

export function redisAllKeys(): string[] {
  return execSync(`redis-cli -h ${REDIS_HOST} -p ${REDIS_PORT} -n ${REDIS_DB} KEYS '*'`)
    .toString()
    .split('\n')
    .map((k) => k.trim())
    .filter(Boolean);
}

export function redisDbSize(): number {
  return Number(
    execSync(`redis-cli -h ${REDIS_HOST} -p ${REDIS_PORT} -n ${REDIS_DB} DBSIZE`).toString().trim(),
  );
}

/**
 * 이번 테스트 실행이 실제로 만든 Redis 키만 추적해서 지우기 위한 헬퍼.
 * FLUSHDB는 DB가 이 스위트 전용이라는 보장이 코드로 강제되지 않는 한 쓰지 않는다.
 *
 * GameGateway.handleDisconnect는 master 연결 해제 시, 그리고 재접속 흐름에서
 * 생기는 `<socket.id> -> {sid,type}` 매핑 키를 지우지 않는 기존 동작이 있어
 * (이번 복구 E2E의 수정 대상이 아님) 이름을 미리 알 수 없다. trackSid로 등록한
 * sid가 값에 포함된 키를 값 기준으로 찾아 함께 지운다.
 */
export class RedisTracker {
  private keys = new Set<string>();
  private sids = new Set<string>();

  track(...keys: string[]) {
    keys.forEach((k) => this.keys.add(k));
  }

  trackSid(sid: string | undefined) {
    if (sid) this.sids.add(sid);
  }

  async cleanup(): Promise<void> {
    if (this.sids.size > 0) {
      for (const key of redisAllKeys()) {
        if (this.keys.has(key)) continue;
        const value = redisGet(key);
        if ([...this.sids].some((sid) => value.includes(sid))) {
          this.keys.add(key);
        }
      }
    }
    redisDel([...this.keys]);
  }
}
