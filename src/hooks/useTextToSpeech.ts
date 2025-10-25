/**
 * React Hook for Text-to-Speech
 * 
 * Usage in any component:
 * ```tsx
 * const { speak, stop, voices, isSpeaking } = useTextToSpeech();
 * 
 * // Speak text
 * await speak("Hello world!");
 * 
 * // Speak with options
 * await speak("Fast speech!", { rate: 1.5, pitch: 1.2 });
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { TextToSpeechService, TTSOptions } from '@/lib/textToSpeech';

export interface UseTextToSpeechOptions {
  autoLoad?: boolean;
  onError?: (error: Error) => void;
}

export interface UseTextToSpeechReturn {
  speak: (text: string, options?: TTSOptions) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  voices: SpeechSynthesisVoice[];
  voicesByLanguage: Record<string, SpeechSynthesisVoice[]>;
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  currentWord: string | null;
}

export function useTextToSpeech(
  options: UseTextToSpeechOptions = {}
): UseTextToSpeechReturn {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voicesByLanguage, setVoicesByLanguage] = useState<Record<string, SpeechSynthesisVoice[]>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [isSupported] = useState(TextToSpeechService.isSupported());

  const ttsRef = useRef<TextToSpeechService | null>(null);
  const statusCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const onErrorRef = useRef(options.onError);

  // Update error handler ref when it changes
  useEffect(() => {
    onErrorRef.current = options.onError;
  }, [options.onError]);

  // Initialize TTS service
  useEffect(() => {
    if (!isSupported) return;

    try {
      ttsRef.current = new TextToSpeechService();
      
      // Load voices
      const loadVoices = () => {
        if (ttsRef.current) {
          const allVoices = ttsRef.current.getVoices();
          setVoices(allVoices);
          setVoicesByLanguage(ttsRef.current.getVoicesByLanguage());
        }
      };

      // Voices may load asynchronously
      loadVoices();
      
      // Set up interval to check voices
      const voiceCheckInterval = setInterval(loadVoices, 500);
      
      // Clean up after 5 seconds (voices should be loaded by then)
      setTimeout(() => clearInterval(voiceCheckInterval), 5000);

      return () => clearInterval(voiceCheckInterval);
    } catch (error) {
      onErrorRef.current?.(error as Error);
    }
  }, [isSupported]);

  // Monitor speaking status
  useEffect(() => {
    if (!isSupported || !ttsRef.current) return;

    // Check status periodically
    statusCheckIntervalRef.current = setInterval(() => {
      if (ttsRef.current) {
        setIsSpeaking(ttsRef.current.isSpeaking());
        setIsPaused(ttsRef.current.isPaused());
      }
    }, 100);

    return () => {
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
      }
    };
  }, [isSupported]);

  // Speak function
  const speak = useCallback(async (text: string, speakOptions?: TTSOptions) => {
    if (!ttsRef.current) {
      throw new Error('TTS not initialized');
    }

    setCurrentWord(null);
    setIsSpeaking(true);

    try {
      await ttsRef.current.speak(text, {
        ...speakOptions,
        onWord: (word, index) => {
          setCurrentWord(word);
          speakOptions?.onWord?.(word, index);
        },
        onStart: () => {
          setIsSpeaking(true);
          setIsPaused(false);
          speakOptions?.onStart?.();
        },
        onEnd: () => {
          setIsSpeaking(false);
          setIsPaused(false);
          setCurrentWord(null);
          speakOptions?.onEnd?.();
        },
        onError: (error) => {
          setIsSpeaking(false);
          setIsPaused(false);
          setCurrentWord(null);
          speakOptions?.onError?.(error);
          onErrorRef.current?.(new Error(error.error));
        }
      });
    } catch (error) {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWord(null);
      throw error;
    }
  }, []);

  // Stop function
  const stop = useCallback(() => {
    if (ttsRef.current) {
      ttsRef.current.stop();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWord(null);
    }
  }, []);

  // Pause function
  const pause = useCallback(() => {
    if (ttsRef.current) {
      ttsRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  // Resume function
  const resume = useCallback(() => {
    if (ttsRef.current) {
      ttsRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    voices,
    voicesByLanguage,
    isSpeaking,
    isPaused,
    isSupported,
    currentWord
  };
}

