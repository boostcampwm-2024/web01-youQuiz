export type ToastType = 'success' | 'warning' | 'error' | 'info';
export type ToastTime = 5 | 10 | 15 | 20 | 30;

export interface ToastProps {
  /** Toast의 고유 id */
  toastId: number;
  /** Toast의 타입 (success | warning | error | info) */
  type: ToastType;
  /** Toast에 표시할 문구 */
  label: string;
  /** Toast가 표시될 시간 (5 | 10 | 15 | 20 | 30) */
  time: ToastTime;
}
