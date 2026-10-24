// Root component: the app shell with the bottom navigation bar.
// Each tab only shows its title for now; the real pages come in later PRs.
// Navigation is plain React state (no router library) to keep it simple.
import { useState } from 'react';
import { BottomNav, type Tab } from './components/BottomNav';
import { TEXT } from './text';

function App() {
  // The app opens on the Today board (docs/user-flows.md).
  const [tab, setTab] = useState<Tab>('today');

  return (
    <div className="app">
      <main className="screen">
        <h1 className="screen-title">{TEXT.screenTitles[tab]}</h1>
      </main>
      <BottomNav current={tab} onChange={setTab} />
    </div>
  );
}

export default App;
