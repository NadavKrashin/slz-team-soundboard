import { useCallback, useState } from 'react';
import { Announcer } from './components/Announcer';
import { Header } from './components/Header';
import { Stage } from './components/Stage';

export default function App() {
  const [touched, setTouched] = useState(false);
  const handlePress = useCallback(() => setTouched(true), []);

  return (
    <div className="app">
      <Header />
      <p className={`hint${touched ? ' hint--hidden' : ''}`} aria-hidden={touched}>
        לחצו על מישהו כדי לשמוע אותו! 👆
      </p>
      <main className="stage-area">
        <Stage onPress={handlePress} />
      </main>
      <Announcer />
    </div>
  );
}
