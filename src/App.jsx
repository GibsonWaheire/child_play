import { AppProvider, useApp } from './contexts/AppContext';
import ChildPlay from './pages/ChildPlay';
import ParentMode from './pages/ParentMode';
import ParentGate from './components/ParentGate';

function Router() {
  const { mode, setMode } = useApp();

  if (mode === 'child')  return <ChildPlay />;
  if (mode === 'gate')   return <ParentGate onSuccess={() => setMode('parent')} onCancel={() => setMode('child')} />;
  if (mode === 'parent') return <ParentMode />;
  return null;
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
