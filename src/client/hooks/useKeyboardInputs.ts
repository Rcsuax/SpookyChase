import { useEffect } from 'react';
import type { Direction } from '../../types';

const KEYS: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  s: 'DOWN',
  a: 'LEFT',
  d: 'RIGHT',
};

function useKeyboardInputs(callback: (direction: Direction) => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat) return;
      const direction = KEYS[event.key.length === 1 ? event.key.toLowerCase() : event.key];
      if (!direction) return;
      event.preventDefault(); 
      callback(direction);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [callback, enabled]);
}

export default useKeyboardInputs;