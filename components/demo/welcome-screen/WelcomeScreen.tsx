
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import './WelcomeScreen.css';
import { useTools, Template } from '../../../lib/state';

// FIX: Updated welcomeContent keys to match Template type ('translator' | 'doctor' | 'lawyer' | 'teacher' | 'assistant') defined in lib/state.ts
const welcomeContent: Record<Template, { title: string; description: string; prompts: string[] }> = {
  'translator': {
    title: 'Real-time Translator',
    description: 'Instantly translate spoken language into your chosen target dialect.',
    prompts: [
      "Hello, how can I help you?",
      "I am looking for the nearest train station.",
      "Could you recommend a good local restaurant?",
    ],
  },
  'doctor': {
    title: 'Medical Doctor',
    description: 'Get empathetic and professional health guidance from an AI doctor.',
    prompts: [
      "I have a persistent headache, what should I do?",
      "How can I improve my sleep quality?",
      "What are the symptoms of seasonal allergies?",
    ],
  },
  'lawyer': {
    title: 'Legal Consultant',
    description: 'Analyze legal concepts and documents with an analytical legal AI.',
    prompts: [
      "What is the difference between a copyright and a trademark?",
      "Can you help me understand this contract clause?",
      "What are basic employee rights in California?",
    ],
  },
  'teacher': {
    title: 'Patient Teacher',
    description: 'Learn complex topics through clear explanations and examples.',
    prompts: [
      "Explain quantum physics like I'm five.",
      "How do I solve quadratic equations?",
      "Tell me about the history of the Renaissance.",
    ],
  },
  'assistant': {
    title: 'Personal Assistant',
    description: 'Manage your schedule, tasks, and stay organized.',
    prompts: [
      'Create a calendar event for a meeting tomorrow at 10am.',
      'Set a reminder to buy milk at 5pm.',
      'Draft an email to my team about the project update.',
    ],
  },
};

const WelcomeScreen: React.FC = () => {
  const { template, setTemplate } = useTools();
  const { title, description, prompts } = welcomeContent[template];
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="title-container">
          <span className="welcome-icon">translate</span>
          <div className="title-selector">
            <select value={template} onChange={(e) => setTemplate(e.target.value as Template)} aria-label="Select a template">
              <option value="translator">Real-time Translator</option>
              <option value="doctor">Medical Doctor</option>
              <option value="lawyer">Legal Consultant</option>
              <option value="teacher">Patient Teacher</option>
              <option value="assistant">Personal Assistant</option>
            </select>
            <span className="icon">arrow_drop_down</span>
          </div>
        </div>
        <p>{description}</p>
        <div className="example-prompts">
          {prompts.map((prompt, index) => (
            <div key={index} className="prompt">{prompt}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
