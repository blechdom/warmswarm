/**
 * Text-to-Speech Utility using Web Speech API
 * 
 * Free, offline-capable, works on all modern browsers
 * - iOS/Safari: 40-80 high-quality Siri voices
 * - Android/Chrome: 10-30 Google TTS voices
 * - Desktop: OS-specific voices (60-90 on macOS, 10-20 on Windows)
 */

export interface TTSOptions {
  voice?: SpeechSynthesisVoice;
  voiceName?: string;
  lang?: string;
  rate?: number;      // 0.1 to 10 (default 1)
  pitch?: number;     // 0 to 2 (default 1)
  volume?: number;    // 0 to 1 (default 1)
  onWord?: (word: string, charIndex: number) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
}

export class TextToSpeechService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private defaultVoice: SpeechSynthesisVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window === 'undefined') {
      throw new Error('TextToSpeechService requires browser environment');
    }
    
    this.synth = window.speechSynthesis;
    this.loadVoices();
  }

  /**
   * Load available voices (async on some browsers)
   */
  private loadVoices(): void {
    this.voices = this.synth.getVoices();

    if (this.voices.length === 0) {
      // Voices load asynchronously on some browsers
      this.synth.addEventListener('voiceschanged', () => {
        this.voices = this.synth.getVoices();
        this.selectDefaultVoice();
      });
    } else {
      this.selectDefaultVoice();
    }
  }

  /**
   * Select a good default voice (prefers local English voices)
   */
  private selectDefaultVoice(): void {
    // Try to find a local English voice
    this.defaultVoice = this.voices.find(voice => 
      voice.lang.startsWith('en-') && voice.localService
    ) || this.voices[0] || null;
  }

  /**
   * Get all available voices
   */
  getVoices(lang?: string): SpeechSynthesisVoice[] {
    if (lang) {
      return this.voices.filter(v => v.lang.startsWith(lang));
    }
    return this.voices;
  }

  /**
   * Find a voice by name
   */
  getVoiceByName(name: string): SpeechSynthesisVoice | undefined {
    return this.voices.find(v => v.name === name);
  }

  /**
   * Get voices grouped by language
   */
  getVoicesByLanguage(): Record<string, SpeechSynthesisVoice[]> {
    const grouped: Record<string, SpeechSynthesisVoice[]> = {};
    
    this.voices.forEach(voice => {
      const lang = voice.lang.split('-')[0]; // Get base language code
      if (!grouped[lang]) {
        grouped[lang] = [];
      }
      grouped[lang].push(voice);
    });
    
    return grouped;
  }

  /**
   * Speak text with options
   */
  speak(text: string, options: TTSOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);

      // Select voice
      if (options.voice) {
        utterance.voice = options.voice;
      } else if (options.voiceName) {
        const voice = this.getVoiceByName(options.voiceName);
        if (voice) utterance.voice = voice;
      } else if (options.lang) {
        const voice = this.voices.find(v => v.lang === options.lang);
        if (voice) utterance.voice = voice;
      } else if (this.defaultVoice) {
        utterance.voice = this.defaultVoice;
      }

      // Set properties
      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;
      utterance.lang = options.lang || 'en-US';

      // Event handlers
      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        options.onError?.(event);
        reject(event);
      };

      // Word boundary tracking
      utterance.onboundary = (event) => {
        if (event.name === 'word' && options.onWord) {
          const word = text.substring(
            event.charIndex, 
            event.charIndex + (event.charLength || 0)
          );
          options.onWord(word, event.charIndex);
        }
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.isSpeaking()) {
      this.synth.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.isPaused()) {
      this.synth.resume();
    }
  }

  /**
   * Stop current speech
   */
  stop(): void {
    this.synth.cancel();
    this.currentUtterance = null;
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synth.speaking;
  }

  /**
   * Check if speech is paused
   */
  isPaused(): boolean {
    return this.synth.paused;
  }

  /**
   * Check if TTS is supported
   */
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}

// Singleton instance
let ttsInstance: TextToSpeechService | null = null;

/**
 * Get singleton TTS instance
 */
export function getTTSService(): TextToSpeechService {
  if (!ttsInstance && TextToSpeechService.isSupported()) {
    ttsInstance = new TextToSpeechService();
  }
  if (!ttsInstance) {
    throw new Error('Text-to-Speech is not supported in this browser');
  }
  return ttsInstance;
}

/**
 * Quick speak function for simple use cases
 */
export async function speak(text: string, options?: TTSOptions): Promise<void> {
  const tts = getTTSService();
  return tts.speak(text, options);
}


