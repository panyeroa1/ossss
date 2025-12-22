
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Default Live API model to use
 */
export const DEFAULT_LIVE_API_MODEL =
  'gemini-2.5-flash-native-audio-preview-09-2025';

export const DEFAULT_VOICE = 'Orus';

export const AVAILABLE_VOICES = ['Zephyr', 'Puck', 'Charon', 'Luna', 'Nova', 'Kore', 'Fenrir', 'Leda', 'Orus', 'Aoede', 'Callirrhoe', 'Autonoe', 'Enceladus', 'Iapetus', 'Umbriel', 'Algieba', 'Despina', 'Erinome', 'Algenib', 'Rasalgethi', 'Laomedeia', 'Achernar', 'Alnilam', 'Schedar', 'Gacrux', 'Pulcherrima', 'Achird', 'Zubenelgenubi', 'Vindemiatrix', 'Sadachbia', 'Sadaltager', 'Sulafat'];

export const SUPPORTED_LANGUAGES = [
  // Global Major Languages
  { label: 'English (US)', value: 'English (United States)' },
  { label: 'English (UK)', value: 'English (United Kingdom)' },
  { label: 'English (Australia)', value: 'English (Australia)' },
  { label: 'English (India)', value: 'English (India)' },
  { label: 'Spanish (Spain)', value: 'Spanish (Spain)' },
  { label: 'Spanish (Mexico)', value: 'Spanish (Mexico)' },
  { label: 'Spanish (Argentina)', value: 'Spanish (Argentina)' },
  { label: 'German (Germany)', value: 'German (Germany)' },
  { label: 'Italian (Italy)', value: 'Italian (Italy)' },
  { label: 'Portuguese (Brazil)', value: 'Portuguese (Brazil)' },
  { label: 'Portuguese (Portugal)', value: 'Portuguese (Portugal)' },
  { label: 'Russian (Russia)', value: 'Russian (Russia)' },
  { label: 'Japanese (Japan)', value: 'Japanese (Japan)' },
  { label: 'Korean (South Korea)', value: 'Korean (South Korea)' },
  { label: 'Chinese (Mandarin, Simplified)', value: 'Chinese (Mandarin, Simplified)' },
  { label: 'Chinese (Mandarin, Traditional)', value: 'Chinese (Mandarin, Traditional)' },
  { label: 'Chinese (Cantonese)', value: 'Chinese (Cantonese)' },
  { label: 'Arabic (Modern Standard)', value: 'Arabic (Modern Standard)' },
  { label: 'Hindi (India)', value: 'Hindi (India)' },
  { label: 'Turkish (Turkey)', value: 'Turkish (Turkey)' },
  { label: 'Vietnamese (Vietnam)', value: 'Vietnamese (Vietnam)' },
  { label: 'Thai (Thailand)', value: 'Thai (Thailand)' },
  { label: 'Indonesian (Indonesia)', value: 'Indonesian (Indonesia)' },

  // Belgium Dialects and Languages
  { label: 'Dutch (Belgium/Flemish)', value: 'Dutch (Belgium/Flemish)' },
  { label: 'Dutch (West Flemish)', value: 'Dutch (West Flemish)' },
  { label: 'Dutch (East Flemish)', value: 'Dutch (East Flemish)' },
  { label: 'Dutch (Brabantian)', value: 'Dutch (Brabantian)' },
  { label: 'Dutch (Limburgish)', value: 'Dutch (Limburgish)' },
  { label: 'French (Belgium)', value: 'French (Belgium)' },
  { label: 'Walloon (Belgium)', value: 'Walloon (Belgium)' },
  { label: 'Picard (Belgium)', value: 'Picard (Belgium)' },
  { label: 'Champenois (Belgium)', value: 'Champenois (Belgium)' },
  { label: 'Lorrain (Belgium)', value: 'Lorrain (Belgium)' },
  { label: 'German (Belgium)', value: 'German (Belgium)' },

  // France Regional Languages and Dialects
  { label: 'French (France)', value: 'French (France)' },
  { label: 'Breton (France)', value: 'Breton (France)' },
  { label: 'Occitan (France)', value: 'Occitan (France)' },
  { label: 'Corsican (France)', value: 'Corsican (France)' },
  { label: 'Alsatian (France)', value: 'Alsatian (France)' },
  { label: 'Basque (France/Spain)', value: 'Basque' },
  { label: 'Catalan (France/Spain)', value: 'Catalan' },
  { label: 'Picard (France)', value: 'Picard (France)' },

  // Philippines Dialects
  { label: 'Filipino (Tagalog)', value: 'Filipino (Tagalog)' },
  { label: 'Cebuano (Philippines)', value: 'Cebuano (Philippines)' },
  { label: 'Ilocano (Philippines)', value: 'Ilocano (Philippines)' },
  { label: 'Hiligaynon (Philippines)', value: 'Hiligaynon (Philippines)' },
  { label: 'Waray-Waray (Philippines)', value: 'Waray-Waray (Philippines)' },
  { label: 'Central Bikol (Philippines)', value: 'Central Bikol (Philippines)' },
  { label: 'Kapampangan (Philippines)', value: 'Kapampangan (Philippines)' },
  { label: 'Pangasinan (Philippines)', value: 'Pangasinan (Philippines)' },

  // Other European & Global
  { label: 'Dutch (Netherlands)', value: 'Dutch (Netherlands)' },
  { label: 'French (Canada)', value: 'French (Canada)' },
  { label: 'French (Switzerland)', value: 'French (Switzerland)' },
  { label: 'German (Austria)', value: 'German (Austria)' },
  { label: 'German (Switzerland)', value: 'German (Switzerland)' },
  { label: 'Greek (Greece)', value: 'Greek (Greece)' },
  { label: 'Hebrew (Israel)', value: 'Hebrew (Israel)' },
  { label: 'Polish (Poland)', value: 'Polish (Poland)' },
  { label: 'Swedish (Sweden)', value: 'Swedish (Sweden)' },
  { label: 'Danish (Denmark)', value: 'Danish (Denmark)' },
  { label: 'Norwegian (Norway)', value: 'Norwegian (Norway)' },
  { label: 'Finnish (Finland)', value: 'Finnish (Finland)' },
  { label: 'Czech (Czech Republic)', value: 'Czech (Czech Republic)' },
  { label: 'Hungarian (Hungary)', value: 'Hungarian (Hungary)' },
  { label: 'Romanian (Romania)', value: 'Romanian (Romania)' },
  { label: 'Ukrainian (Ukraine)', value: 'Ukrainian (Ukraine)' },
  { label: 'Malay (Malaysia)', value: 'Malay (Malaysia)' },
  { label: 'Swahili (East Africa)', value: 'Swahili (East Africa)' }
];
