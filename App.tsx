
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import ErrorScreen from './components/demo/ErrorScreen';
import StreamingConsole from './components/demo/streaming-console/StreamingConsole';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AudioVisualizer from './components/AudioVisualizer';
import { LiveAPIProvider } from './contexts/LiveAPIContext';
import { useSettings } from './lib/state';
import cn from 'classnames';

const API_KEY = process.env.API_KEY as string;
if (typeof API_KEY !== 'string') {
  throw new Error(
    'Missing required environment variable: API_KEY'
  );
}

function App() {
  const { theme } = useSettings();

  return (
    <div className={cn("App", `theme-${theme}`)}>
      <LiveAPIProvider apiKey={API_KEY}>
        <AudioVisualizer />
        <ErrorScreen />
        <Header />
        <Sidebar />
        <div className="streaming-console">
          <main>
            <div className="main-app-area">
              <StreamingConsole />
            </div>
          </main>
        </div>
      </LiveAPIProvider>
    </div>
  );
}

export default App;
