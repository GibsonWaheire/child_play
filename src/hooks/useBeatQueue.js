import { useRef, useState, useCallback } from 'react';

const TEMPO_MS = 300;
const SWING    = 0.10;

export function useBeatQueue(onDequeue) {
  const queueRef   = useRef([]);
  const playingRef = useRef(false);
  const stepRef    = useRef(0);
  const onDequeueRef = useRef(onDequeue);
  onDequeueRef.current = onDequeue;

  const [activeDot, setActiveDot] = useState(-1);
  const [queueLen,  setQueueLen]  = useState(0);

  const tick = useCallback(() => {
    const step = stepRef.current % 8;
    setActiveDot(step);
    stepRef.current++;

    if (queueRef.current.length === 0) {
      playingRef.current = false;
      setTimeout(() => setActiveDot(-1), 350);
      return;
    }

    const key = queueRef.current.shift();
    setQueueLen(queueRef.current.length);
    onDequeueRef.current(key);

    const delay = TEMPO_MS + (stepRef.current % 2 === 0 ? TEMPO_MS * SWING : -(TEMPO_MS * SWING));
    setTimeout(tick, delay);
  }, []);

  const enqueue = useCallback((key) => {
    queueRef.current.push(key);
    setQueueLen(queueRef.current.length);
    if (!playingRef.current) {
      playingRef.current = true;
      setTimeout(tick, 0);
    }
  }, [tick]);

  const popLast = useCallback(() => {
    if (queueRef.current.length > 0) {
      queueRef.current.pop();
      setQueueLen(queueRef.current.length);
      return true;
    }
    return false;
  }, []);

  const clearAll = useCallback(() => {
    queueRef.current = [];
    setQueueLen(0);
  }, []);

  return { enqueue, popLast, clearAll, activeDot, queueLen };
}
