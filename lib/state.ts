
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { DEFAULT_LIVE_API_MODEL, DEFAULT_VOICE } from './constants';
import {
  FunctionDeclaration,
  FunctionResponseScheduling,
} from '@google/genai';

export type Template = 'translator' | 'doctor' | 'lawyer' | 'teacher' | 'assistant';
export type SourceType = 'microphone' | 'youtube' | 'jitsi' | 'url';
export type AudioInputSource = 'mic' | 'system';
export type SidebarSubView = 'home' | 'sources' | 'chat' | 'audio' | 'themes' | 'logs' | 'participants';
export type AppTheme = 'midnight' | 'cyberpunk' | 'minimalist' | 'matrix' | 'royal';

export interface ToolDefinition extends FunctionDeclaration {
  name: string;
  description?: string;
  parameters?: any;
  isEnabled?: boolean;
  scheduling?: FunctionResponseScheduling;
}

export interface AgentPersona {
  id: Template;
  name: string;
  icon: string; // Material symbol name
  instruction: string;
}

const getTranslationPrompt = (lang: string) => `### MIRROR-STYLE SPEECH TRANSLATOR ###
ROLE: Native translator into ${lang}.
RULE: Output ONLY the translated text. No explanations.
STYLE: Mimic spoken delivery, contractions, and emphasis.`;

export const AGENT_PERSONAS: AgentPersona[] = [
  { 
    id: 'translator', 
    name: 'Translator', 
    icon: 'translate', 
    instruction: getTranslationPrompt('English (United States)') 
  },
  { 
    id: 'doctor', 
    name: 'Doctor', 
    icon: 'medical_services', 
    instruction: 'You are an empathetic medical doctor. Provide health guidance and always include a disclaimer.' 
  },
  { 
    id: 'lawyer', 
    name: 'Lawyer', 
    icon: 'gavel', 
    instruction: 'You are a precise legal consultant. Help understand legal concepts without providing official legal advice.' 
  },
  { 
    id: 'teacher', 
    name: 'Teacher', 
    icon: 'school', 
    instruction: 'You are a patient teacher. Simplify complex topics with clear examples.' 
  },
  { 
    id: 'assistant', 
    name: 'Assistant', 
    icon: 'smart_toy', 
    instruction: 'You are a proactive personal assistant. Help organize tasks efficiently.' 
  },
];

export const useTools = create<{
  template: Template;
  setTemplate: (template: Template) => void;
}>((set) => ({
  template: 'translator',
  setTemplate: (template) => {
    set({ template });
    useSettings.getState().setSelectedAgentId(template);
  },
}));

export const useSettings = create<{
  systemPrompt: string;
  model: string;
  voice: string;
  targetLanguage: string;
  sourceType: SourceType;
  audioInputSource: AudioInputSource;
  selectedMicrophoneId: string;
  micGain: number;
  youtubeUrl: string;
  jitsiUrl: string;
  customUrl: string;
  theme: AppTheme;
  selectedAgentId: Template;
  screenShareStream: MediaStream | null;
  setSystemPrompt: (prompt: string) => void;
  setModel: (model: string) => void;
  setVoice: (voice: string) => void;
  setTargetLanguage: (lang: string) => void;
  setSourceType: (type: SourceType) => void;
  setAudioInputSource: (source: AudioInputSource) => void;
  setSelectedMicrophoneId: (id: string) => void;
  setMicGain: (gain: number) => void;
  setYoutubeUrl: (url: string) => void;
  setJitsiUrl: (url: string) => void;
  setCustomUrl: (url: string) => void;
  setTheme: (theme: AppTheme) => void;
  setSelectedAgentId: (id: Template) => void;
  setScreenShareStream: (stream: MediaStream | null) => void;
}>(set => ({
  systemPrompt: AGENT_PERSONAS[0].instruction,
  model: DEFAULT_LIVE_API_MODEL,
  voice: DEFAULT_VOICE,
  targetLanguage: 'English (United States)',
  sourceType: 'microphone',
  audioInputSource: 'mic',
  selectedMicrophoneId: 'default',
  micGain: 1.0,
  youtubeUrl: '',
  jitsiUrl: '',
  customUrl: '',
  theme: 'midnight',
  selectedAgentId: 'translator',
  screenShareStream: null,
  setSystemPrompt: prompt => set({ systemPrompt: prompt }),
  setModel: model => set({ model }),
  setVoice: voice => set({ voice }),
  setTargetLanguage: lang => set(state => {
    const isTranslator = state.selectedAgentId === 'translator';
    const newPrompt = isTranslator ? getTranslationPrompt(lang) : state.systemPrompt;
    return { targetLanguage: lang, systemPrompt: newPrompt };
  }),
  setSourceType: sourceType => set({ sourceType }),
  setAudioInputSource: audioInputSource => set({ audioInputSource }),
  setSelectedMicrophoneId: selectedMicrophoneId => set({ selectedMicrophoneId }),
  setMicGain: micGain => set({ micGain }),
  setYoutubeUrl: youtubeUrl => set({ youtubeUrl }),
  setJitsiUrl: jitsiUrl => set({ jitsiUrl }),
  setCustomUrl: customUrl => set({ customUrl }),
  setTheme: theme => set({ theme }),
  setSelectedAgentId: id => set(state => {
    const agent = AGENT_PERSONAS.find(a => a.id === id);
    if (!agent) return state;
    let newInstruction = agent.instruction;
    if (id === 'translator') {
        newInstruction = getTranslationPrompt(state.targetLanguage);
    }
    useTools.setState({ template: id });
    return { selectedAgentId: id, systemPrompt: newInstruction };
  }),
  setScreenShareStream: screenShareStream => set({ screenShareStream }),
}));

export const useUI = create<{
  isSidebarOpen: boolean;
  sidebarSubView: SidebarSubView;
  toggleSidebar: () => void;
  setSidebarSubView: (view: SidebarSubView) => void;
}>(set => ({
  isSidebarOpen: true,
  sidebarSubView: 'home',
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarSubView: (view) => set({ sidebarSubView: view }),
}));

export interface ConversationTurn {
  timestamp: Date;
  role: 'user' | 'agent' | 'system';
  text: string;
  isFinal: boolean;
}

export const useLogStore = create<{
  turns: ConversationTurn[];
  addTurn: (turn: Omit<ConversationTurn, 'timestamp'>) => void;
  updateLastTurn: (update: Partial<ConversationTurn>) => void;
  clearTurns: () => void;
}>((set) => ({
  turns: [],
  addTurn: (turn) => set(state => ({ turns: [...state.turns, { ...turn, timestamp: new Date() }] })),
  updateLastTurn: (update) => set(state => {
    if (state.turns.length === 0) return state;
    const newTurns = [...state.turns];
    newTurns[newTurns.length - 1] = { ...newTurns[newTurns.length - 1], ...update };
    return { turns: newTurns };
  }),
  clearTurns: () => set({ turns: [] }),
}));
