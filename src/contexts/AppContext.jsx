import { createContext, useContext, useRef, useState } from 'react';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [mode, setMode] = useState('child'); // 'child' | 'gate' | 'parent'

  // Session stats — updated by ChildPlay, read by ParentMode
  const statsRef = useRef({
    keyCount:   0,
    stars:      0,
    magicWords: [],
    startTime:  null,
  });

  function resetStats() {
    statsRef.current = { keyCount: 0, stars: 0, magicWords: [], startTime: null };
  }

  return (
    <Ctx.Provider value={{ mode, setMode, statsRef, resetStats }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);
