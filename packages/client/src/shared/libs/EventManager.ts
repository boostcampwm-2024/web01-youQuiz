export const enum ToastEvent {
  ADD = 'ADD',
  DELETE = 'DELETE',
}

export type EventType = ToastEvent;

export const EventManager = {
  list: new Map<EventType, (...args: any[]) => void>(),

  on: (eventType: EventType, callback: (...args: any[]) => void) => {
    EventManager.list.set(eventType, callback);
  },

  off: (eventType: EventType) => {
    EventManager.list.delete(eventType);
  },

  // emit 수정
  emit: (eventType: EventType, ...args: any[]) => {
    const callback = EventManager.list.get(eventType);
    if (callback) {
      callback(...args);
    }
  },
};
