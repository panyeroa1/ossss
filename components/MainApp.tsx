import React from 'react';
import ErrorScreen from './demo/ErrorScreen';
import StreamingConsole from './demo/streaming-console/StreamingConsole';
import Header from './Header';
import Sidebar from './Sidebar';
import AudioVisualizer from './AudioVisualizer';
import { LiveAPIProvider } from '../contexts/LiveAPIContext';
import { useSettings } from '../lib/state';
import cn from 'classnames';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

const MainApp: React.FC = () => {
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
};

export default MainApp;
