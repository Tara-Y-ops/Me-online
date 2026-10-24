// Root component. First-time players go through onboarding; after that the
// app opens on the main pages with the bottom navigation bar.
// Each tab only shows its title for now; the real pages come in later PRs.
// Navigation is plain React state (no router library) to keep it simple.
import { useState } from 'react';
import { BottomNav, type Tab } from './components/BottomNav';
import { Onboarding } from './screens/onboarding/Onboarding';
import { loadProfile, saveProfile, type Profile } from './storage/profile';
import { TEXT } from './text';

function App() {
  // A saved profile means onboarding is done, so skip it on later visits.
  const [profile, setProfile] = useState<Profile | null>(() => loadProfile());
  // The app opens on the Today board (docs/user-flows.md).
  const [tab, setTab] = useState<Tab>('today');

  function finishOnboarding(newProfile: Profile) {
    saveProfile(newProfile);
    setProfile(newProfile);
  }

  if (!profile) {
    return (
      <div className="app">
        <Onboarding onFinish={finishOnboarding} />
      </div>
    );
  }

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
