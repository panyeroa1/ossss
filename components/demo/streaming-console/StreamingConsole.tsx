
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useEffect, useRef } from 'react';
import { Modality, LiveServerContent } from '@google/genai';
import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';
import {
  useSettings,
  useLogStore,
} from '@/lib/state';

export default function StreamingConsole() {
  const { client, setConfig } = useLiveAPIContext();
  const { 
    systemPrompt, 
    voice, 
    audioInputSource, 
    screenShareStream,
    sourceType,
    youtubeUrl,
    jitsiUrl,
    customUrl
  } = useSettings();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const config: any = {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: voice,
          },
        },
      },
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      systemInstruction: systemPrompt,
      tools: [],
    };
    setConfig(config);
  }, [setConfig, systemPrompt, voice]);

  useEffect(() => {
    const { addTurn, updateLastTurn } = useLogStore.getState();

    const handleInputTranscription = (text: string, isFinal: boolean) => {
      const currentTurns = useLogStore.getState().turns;
      const last = currentTurns[currentTurns.length - 1];
      if (last && last.role === 'user' && !last.isFinal) {
        updateLastTurn({ text: last.text + text, isFinal });
      } else {
        addTurn({ role: 'user', text, isFinal });
      }
    };

    const handleOutputTranscription = (text: string, isFinal: boolean) => {
      const currentTurns = useLogStore.getState().turns;
      const last = currentTurns[currentTurns.length - 1];
      if (last && last.role === 'agent' && !last.isFinal) {
        updateLastTurn({ text: last.text + text, isFinal });
      } else {
        addTurn({ role: 'agent', text, isFinal });
      }
    };

    const handleContent = (serverContent: LiveServerContent) => {
      const text = serverContent.modelTurn?.parts?.map((p: any) => p.text).filter(Boolean).join(' ') ?? '';
      if (!text) return;
      const currentTurns = useLogStore.getState().turns;
      const last = currentTurns.at(-1);
      if (last?.role === 'agent' && !last.isFinal) {
        updateLastTurn({ text: last.text + text });
      } else {
        addTurn({ role: 'agent', text, isFinal: false });
      }
    };

    const handleTurnComplete = () => {
      const last = useLogStore.getState().turns.at(-1);
      if (last && !last.isFinal) {
        updateLastTurn({ isFinal: true });
      }
    };

    client.on('inputTranscription', handleInputTranscription);
    client.on('outputTranscription', handleOutputTranscription);
    client.on('content', handleContent);
    client.on('turncomplete', handleTurnComplete);

    return () => {
      client.off('inputTranscription', handleInputTranscription);
      client.off('outputTranscription', handleOutputTranscription);
      client.off('content', handleContent);
      client.off('turncomplete', handleTurnComplete);
    };
  }, [client]);

  useEffect(() => {
    if (videoRef.current && screenShareStream) {
      videoRef.current.srcObject = screenShareStream;
    }
  }, [screenShareStream]);

  // Helper to extract YouTube Video ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  return (
    <div className="fullscreen-container">
      <img
        className="ambient-background"
        src="https://eburon.ai/orbit/orbit.png"
        alt="Ambient Background"
      />

      <div className="content-frame">
        {sourceType === 'youtube' && youtubeUrl && (
          <div className="iframe-wrapper animate-in">
            <iframe
              src={`https://www.youtube.com/embed/${getYoutubeId(youtubeUrl)}?autoplay=1&mute=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {sourceType === 'jitsi' && jitsiUrl && (
          <div className="iframe-wrapper animate-in">
            <iframe
              src={`https://meet.jit.si/${jitsiUrl}`}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
            />
          </div>
        )}

        {sourceType === 'url' && customUrl && (
          <div className="iframe-wrapper animate-in">
            <iframe
              src={customUrl}
              allow="autoplay; encrypted-media; camera; microphone"
            />
          </div>
        )}

        {audioInputSource === 'system' && screenShareStream && (
          <video
            ref={videoRef}
            className="fullscreen-video animate-in"
            autoPlay
            playsInline
            muted
          />
        )}
      </div>
    </div>
  );
}
