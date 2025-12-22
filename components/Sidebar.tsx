
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSettings, useUI, useLogStore, AudioInputSource, SidebarSubView, AGENT_PERSONAS, AppTheme, SourceType } from '@/lib/state';
import c from 'classnames';
import { AVAILABLE_VOICES, SUPPORTED_LANGUAGES } from '@/lib/constants';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { AudioRecorder } from '@/lib/audio-recorder';

const navItems: { id: SidebarSubView; icon: string; label: string }[] = [
  { id: 'home', icon: 'adjust', label: 'Orbit' },
  { id: 'sources', icon: 'grid_view', label: 'Inputs' },
  { id: 'chat', icon: 'bubble_chart', label: 'Dialog' },
  { id: 'audio', icon: 'waves', label: 'Sound' },
  { id: 'themes', icon: 'contrast', label: 'Skin' },
  { id: 'logs', icon: 'terminal', label: 'Telemetry' },
  { id: 'participants', icon: 'groups_3', label: 'People' },
];

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar, sidebarSubView, setSidebarSubView } = useUI();
  const { 
    systemPrompt, voice, targetLanguage, audioInputSource,
    selectedMicrophoneId, micGain, setSystemPrompt, setVoice, 
    setTargetLanguage, setAudioInputSource, setSelectedMicrophoneId,
    setMicGain, setScreenShareStream, screenShareStream, theme, 
    setTheme, selectedAgentId, setSelectedAgentId,
    sourceType, setSourceType, youtubeUrl, setYoutubeUrl,
    jitsiUrl, setJitsiUrl, customUrl, setCustomUrl
  } = useSettings();
  
  const { client, connected, connect, disconnect } = useLiveAPIContext();
  const turns = useLogStore(state => state.turns);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [chatMessage, setChatMessage] = useState('');

  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const refreshDevices = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices(allDevices.filter(d => d.kind === 'audioinput'));
    } catch (err) {
      console.error("Error refreshing devices:", err);
    }
  }, []);

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  useEffect(() => {
    if ((sidebarSubView === 'logs' || sidebarSubView === 'chat') && contentScrollRef.current) {
      contentScrollRef.current.scrollTop = contentScrollRef.current.scrollHeight;
    }
  }, [turns, sidebarSubView]);

  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([{ mimeType: 'audio/pcm;rate=16000', data: base64 }]);
    };
    if (connected && !muted && audioRecorder) {
      audioRecorder.on('data', onData);
      if (audioInputSource === 'mic') {
        audioRecorder.start(selectedMicrophoneId).then(() => audioRecorder.setGain(micGain));
      } else if (screenShareStream) {
        audioRecorder.start(screenShareStream).then(() => audioRecorder.setGain(micGain));
      }
    } else {
      audioRecorder.stop();
    }
    return () => { audioRecorder.off('data', onData); audioRecorder.stop(); };
  }, [connected, client, muted, audioRecorder, audioInputSource, screenShareStream, selectedMicrophoneId, micGain]);

  const handleAudioSourceToggle = async (source: AudioInputSource) => {
    setPermissionError(null);
    audioRecorder.stop();
    if (source === 'mic') {
      setAudioInputSource('mic');
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
        if (stream.getAudioTracks().length === 0) {
          setPermissionError("Check system audio permissions.");
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        setAudioInputSource('system');
        setScreenShareStream(stream);
      } catch {
        setPermissionError("Access was declined.");
      }
    }
  };

  const handleScrollNav = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 150;
      scrollContainerRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  const renderContent = () => {
    switch (sidebarSubView) {
      case 'home':
        return (
          <div className="sidebar-sub-view animate-in">
            <div className="sidebar-group-box">
              <span className="sidebar-group-title">Persona Grid</span>
              <div className="agent-grid-selector">
                {AGENT_PERSONAS.map(agent => (
                  <button 
                    key={agent.id} 
                    className={c("persona-card", { active: selectedAgentId === agent.id })}
                    onClick={() => setSelectedAgentId(agent.id)}
                  >
                    <div className="persona-icon-circle"><span className="icon">{agent.icon}</span></div>
                    <span className="persona-label">{agent.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-group-box">
              <div className="sidebar-field">
                <label>Linguistic Target</label>
                <select value={targetLanguage} onChange={e => setTargetLanguage(e.target.value)}>
                  {SUPPORTED_LANGUAGES.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
                </select>
              </div>
              <div className="sidebar-field">
                <label>Vocal Profile</label>
                <select value={voice} onChange={e => setVoice(e.target.value)}>
                  {AVAILABLE_VOICES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="sidebar-field">
                <label>System Directives</label>
                <textarea 
                  value={systemPrompt} 
                  onChange={e => setSystemPrompt(e.target.value)} 
                  rows={5} 
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
        );
      case 'sources':
        return (
          <div className="sidebar-sub-view animate-in">
            <div className="sidebar-group-box">
              <span className="sidebar-group-title">Input Selector</span>
              <div className="source-type-selector">
                {(['microphone', 'youtube', 'jitsi', 'url'] as SourceType[]).map(type => (
                  <button 
                    key={type}
                    className={c('source-type-btn', { active: sourceType === type })}
                    onClick={() => setSourceType(type)}
                  >
                    <span className="icon">{
                      type === 'microphone' ? 'mic' : 
                      type === 'youtube' ? 'smart_display' : 
                      type === 'jitsi' ? 'video_chat' : 'link'
                    }</span>
                    <span className="source-type-label">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-group-box">
              {sourceType === 'youtube' && (
                <div className="sidebar-field animate-in">
                  <label>Media URL</label>
                  <input type="text" placeholder="YouTube Link..." value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} />
                </div>
              )}
              {sourceType === 'jitsi' && (
                <div className="sidebar-field animate-in">
                  <label>Room Key</label>
                  <input type="text" placeholder="Workspace ID..." value={jitsiUrl} onChange={e => setJitsiUrl(e.target.value)} />
                </div>
              )}
              {sourceType === 'url' && (
                <div className="sidebar-field animate-in">
                  <label>Web Interface</label>
                  <input type="text" placeholder="https://..." value={customUrl} onChange={e => setCustomUrl(e.target.value)} />
                </div>
              )}
              {sourceType === 'microphone' && (
                <div className="info-alert animate-in"><span className="icon">mic</span>Signal routing ready.</div>
              )}
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="sidebar-sub-view animate-in">
            <div className="chat-thread" ref={contentScrollRef}>
              {turns.length === 0 ? (
                <div className="empty-state">
                  <span className="icon">chat_bubble</span>
                  <p>Initializing telemetry stream...</p>
                </div>
              ) : (
                turns.filter(t => t.role !== 'system').map((turn, idx) => (
                  <div key={idx} className={c('bubble-row', turn.role)}>
                    <div className="bubble-content">
                      <span className="bubble-author">{turn.role === 'user' ? 'Operator' : 'Orbit'}</span>
                      <div className="bubble-text-box">{turn.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form className="chat-composer" onSubmit={e => { e.preventDefault(); handleSendChatMessage(); }}>
              <input type="text" placeholder="Message Orbit Agent..." value={chatMessage} onChange={e => setChatMessage(e.target.value)} />
              <button type="submit" className="composer-send-btn"><span className="icon">north</span></button>
            </form>
          </div>
        );
      case 'audio':
        return (
          <div className="sidebar-sub-view animate-in">
            <div className="sidebar-group-box">
              <span className="sidebar-group-title">Acoustic Logic</span>
              <div className="source-type-selector">
                <button className={c('source-type-btn', { active: audioInputSource === 'mic' })} onClick={() => handleAudioSourceToggle('mic')}>
                  <span className="icon">mic</span><span className="source-type-label">Local</span>
                </button>
                <button className={c('source-type-btn', { active: audioInputSource === 'system' })} onClick={() => handleAudioSourceToggle('system')}>
                  <span className="icon">speaker_group</span><span className="source-type-label">Loop</span>
                </button>
              </div>
            </div>

            <div className="sidebar-group-box">
              <span className="sidebar-group-title">Interface Sync</span>
              {permissionError && <div className="error-alert"><span className="icon">error</span>{permissionError}</div>}
              {audioInputSource === 'mic' ? (
                <div className="sidebar-field">
                  <label>Hardware Selection</label>
                  <div className="flex-row-gap">
                    <select value={selectedMicrophoneId} onChange={e => setSelectedMicrophoneId(e.target.value)} style={{ flex: 1 }}>
                      {devices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || 'Default Hub'}</option>)}
                    </select>
                    <button className="icon-action-btn" onClick={refreshDevices}><span className="icon">sync</span></button>
                  </div>
                </div>
              ) : (
                <div className="info-alert"><span className="icon">speaker</span>Capturing tab acoustics.</div>
              )}
              <div className="sidebar-field">
                <div className="flex-row-justify"><label>Gain Sensitivity</label><span>{Math.round(micGain * 100)}%</span></div>
                <input type="range" min="0" max="3" step="0.05" value={micGain} onChange={e => setMicGain(parseFloat(e.target.value))} className="settings-slider" />
              </div>
            </div>
          </div>
        );
      case 'themes':
        return (
          <div className="sidebar-sub-view animate-in">
             <span className="sidebar-group-title">Visual Skins</span>
             <div className="skin-grid">
               {(['midnight', 'cyberpunk', 'minimalist', 'matrix', 'royal'] as AppTheme[]).map(t => (
                 <button key={t} className={c("skin-card", { active: theme === t })} onClick={() => setTheme(t)}>
                   <span className="skin-name" style={{ textTransform: 'capitalize' }}>{t}</span>
                 </button>
               ))}
             </div>
          </div>
        );
      case 'logs':
        return (
          <div className="sidebar-sub-view animate-in">
            <span className="sidebar-group-title">Telemetery Engine</span>
            <div className="log-scroller" ref={contentScrollRef}>
              {turns.length === 0 ? <div className="empty-state">No OS activity found.</div> : (
                turns.map((t, idx) => (
                  <div key={idx} className={c('log-row', t.role)}>
                    <span className="log-timestamp">[{t.timestamp.toLocaleTimeString([], { hour12: false })}]</span>
                    <span className="log-msg">{t.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'participants':
        return (
          <div className="sidebar-sub-view animate-in">
            <div className="empty-state">
              <span className="icon">diversity_3</span>
              <p>Multi-user protocol inactive.</p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return;
    client.send([{ text: chatMessage }], true);
    setChatMessage('');
  };

  return (
    <aside className={c('sidebar', { open: isSidebarOpen })}>
      <div className="sidebar-top-bar">
        <h2 className="brand-text">ORBIT OS</h2>
        <button onClick={toggleSidebar} className="sidebar-hide-btn"><span className="icon">expand_more</span></button>
      </div>
      
      <div className="sidebar-main">
        <div className="session-master-controls">
          <button className={c('btn-start-session', { active: connected })} onClick={connected ? disconnect : connect}>
            <span className="icon">{connected ? 'radar' : 'power_settings_new'}</span>
            <span>{connected ? 'Terminate Sync' : 'Initialize OS'}</span>
          </button>
          <div className="utility-bar">
            <button className={c('util-btn', { enabled: !muted })} onClick={() => setMuted(!muted)} title="Mute Signal"><span className="icon">{muted ? 'mic_off' : 'mic'}</span></button>
            <button className="util-btn" onClick={() => useLogStore.getState().clearTurns()} title="Purge Cache"><span className="icon">restart_alt</span></button>
          </div>
        </div>
        <div className="sub-view-wrapper">{renderContent()}</div>
      </div>
      
      <div className="sidebar-bottom-nav">
        <div className="nav-scroll-controls left">
          <button className="scroll-arrow-btn" onClick={() => handleScrollNav('left')}><span className="icon">chevron_left</span></button>
        </div>
        
        <div className="nav-scroll-viewport" ref={scrollContainerRef}>
          <div className="nav-tab-list">
            {navItems.map(item => (
              <button key={item.id} className={c('nav-tab-btn', { active: sidebarSubView === item.id })} onClick={() => setSidebarSubView(item.id)}>
                <span className="icon">{item.icon}</span>
                <span className="nav-tab-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="nav-scroll-controls right">
          <button className="scroll-arrow-btn" onClick={() => handleScrollNav('right')}><span className="icon">chevron_right</span></button>
        </div>
      </div>
    </aside>
  );
}
