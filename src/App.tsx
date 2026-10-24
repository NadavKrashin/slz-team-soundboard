import { Announcer } from './components/Announcer';
import { Header } from './components/Header';
import { Stage } from './components/Stage';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="stage-area">
        <Stage />
      </main>
      <Announcer />
    </div>
  );
}
