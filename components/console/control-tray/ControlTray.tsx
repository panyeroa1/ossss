
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import cn from 'classnames';
import { memo, ReactNode, useEffect, useRef, useState } from 'react';
import { AudioRecorder } from '../../../lib/audio-recorder';
import { useSettings, useLogStore } from '@/lib/state';
import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';
import { audioContext } from '../../../lib/utils';

export type ControlTrayProps = {
  children?: ReactNode;
};

function ControlTray({ children }: ControlTrayProps) {
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const connectButtonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const { client, connected, connect, disconnect } = useLiveAPIContext();
  const { streamUrl, isStreamActive } = useSettings();

  useEffect(() => {
    if (!connected && connectButtonRef.current) {
      connectButtonRef.current.focus();
    }
  }, [connected]);

  useEffect(() => {
    if (!connected) {
      setMuted(false);
    }
  }, [connected]);

  // Handle Microphone
  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([{
        mimeType: 'audio/pcm;rate=16000',
        data: base64,
      }]);
    };
    if (connected && !muted && audioRecorder) {
      audioRecorder.on('data', onData);
      audioRecorder.start();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off('data', onData);
    };
  }, [connected, client, muted, audioRecorder]);

  // Handle External Stream URL
  useEffect(() => {
    let active = true;

    const setupStream = async () => {
      if (connected && isStreamActive && streamUrl && audioRef.current) {
        const ctx = await audioContext({ sampleRate: 16000 });
        
        if (!streamSourceRef.current) {
          streamSourceRef.current = ctx.createMediaElementSource(audioRef.current);
        }

        if (!scriptProcessorRef.current) {
          // ScriptProcessor for simplicity in capture
          scriptProcessorRef.current = ctx.createScriptProcessor(4096, 1, 1);
          scriptProcessorRef.current.onaudioprocess = (e) => {
            if (!active || !connected || !isStreamActive) return;
            const inputData = e.inputBuffer.getChannelData(0);
            
            // Convert to Int16 PCM
            const pcmData = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
            }

            // Convert to Base64
            const base64 = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
            client.sendRealtimeInput([{
              mimeType: 'audio/pcm;rate=16000',
              data: base64,
            }]);
          };
        }

        streamSourceRef.current.connect(scriptProcessorRef.current);
        scriptProcessorRef.current.connect(ctx.destination);
        audioRef.current.play().catch(console.error);
      } else if (audioRef.current) {
        audioRef.current.pause();
        if (scriptProcessorRef.current) {
          scriptProcessorRef.current.disconnect();
          scriptProcessorRef.current = null;
        }
      }
    };

    setupStream();

    return () => {
      active = false;
      if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
      }
    };
  }, [connected, isStreamActive, streamUrl, client]);

  const handleMicClick = () => {
    if (connected) {
      setMuted(!muted);
    } else {
      connect();
    }
  };

  const handleExportLogs = () => {
    const { systemPrompt, model } = useSettings.getState();
    const { turns } = useLogStore.getState();
    const logData = {
      configuration: { model, systemPrompt },
      conversation: turns.map(turn => ({
        ...turn,
        timestamp: turn.timestamp.toISOString(),
      })),
    };
    const jsonString = JSON.stringify(logData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="control-tray">
      {/* Hidden audio element for stream capture */}
      <audio 
        ref={audioRef} 
        src={streamUrl} 
        crossOrigin="anonymous" 
        style={{ display: 'none' }} 
      />

      <nav className={cn('actions-nav')}>
        <button
          className={cn('action-button mic-button')}
          onClick={handleMicClick}
          title={connected ? (muted ? 'Unmute' : 'Mute') : 'Connect'}
        >
          {!muted ? (
            <span className="material-symbols-outlined filled">mic</span>
          ) : (
            <span className="material-symbols-outlined filled">mic_off</span>
          )}
        </button>
        <button
          className={cn('action-button')}
          onClick={handleExportLogs}
          title="Export session logs"
        >
          <span className="icon">download</span>
        </button>
        <button
          className={cn('action-button')}
          onClick={useLogStore.getState().clearTurns}
          title="Reset session logs"
        >
          <span className="icon">refresh</span>
        </button>
        {children}
      </nav>

      <div className={cn('connection-container', { connected })}>
        <div className="connection-button-container">
          <button
            ref={connectButtonRef}
            className={cn('action-button connect-toggle', { connected })}
            onClick={connected ? disconnect : connect}
            title={connected ? 'Stop' : 'Start'}
          >
            <span className="material-symbols-outlined filled">
              {connected ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>
        <span className="text-indicator">Streaming</span>
      </div>
    </section>
  );
}

export default memo(ControlTray);
