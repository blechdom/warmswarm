/**
 * Synchronized Audio Playback Hook
 * 
 * Provides millisecond-accurate synchronized audio playback across multiple devices
 * in the same swarm using time synchronization and Web Audio API.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';

interface AudioMessage {
  audioData: ArrayBuffer;
  playAtTime: number; // Server timestamp when audio should play
  duration: number;
  messageId: string;
}

interface TimeSync {
  offset: number; // Difference between server time and local time
  rtt: number; // Round-trip time
  lastSync: number;
}

export function useSyncedAudio(socket: Socket | null, swarmId: string) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [timeSync, setTimeSync] = useState<TimeSync>({ offset: 0, rtt: 0, lastSync: 0 });
  const [isReady, setIsReady] = useState(false);
  const pendingAudioRef = useRef<Map<string, AudioMessage>>(new Map());
  
  // Initialize Web Audio API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      setIsReady(true);
    }
    
    return () => {
      audioContextRef.current?.close();
    };
  }, []);
  
  // Time synchronization with server (NTP-style algorithm)
  const syncTime = useCallback(async () => {
    if (!socket) return;
    
    const samples: { offset: number; rtt: number }[] = [];
    
    // Take 5 samples for accuracy
    for (let i = 0; i < 5; i++) {
      const t0 = Date.now();
      
      const serverTime = await new Promise<number>((resolve) => {
        socket.emit('time-sync-request', t0);
        socket.once('time-sync-response', ({ clientTime, serverTime }) => {
          resolve(serverTime);
        });
      });
      
      const t3 = Date.now();
      const rtt = t3 - t0;
      const offset = serverTime - (t0 + rtt / 2);
      
      samples.push({ offset, rtt });
      
      // Wait a bit between samples
      if (i < 4) await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Use median to filter outliers
    samples.sort((a, b) => a.rtt - b.rtt);
    const medianSample = samples[Math.floor(samples.length / 2)];
    
    setTimeSync({
      offset: medianSample.offset,
      rtt: medianSample.rtt,
      lastSync: Date.now(),
    });
    
    console.log(`[SyncedAudio] Time synced: offset=${medianSample.offset}ms, RTT=${medianSample.rtt}ms`);
  }, [socket]);
  
  // Get synchronized server time
  const getServerTime = useCallback((): number => {
    return Date.now() + timeSync.offset;
  }, [timeSync.offset]);
  
  // Schedule audio playback at precise time
  const scheduleAudioPlayback = useCallback(async (
    audioData: ArrayBuffer,
    playAtServerTime: number,
    messageId: string
  ) => {
    if (!audioContextRef.current) return;
    
    const audioContext = audioContextRef.current;
    const currentServerTime = getServerTime();
    const delayMs = playAtServerTime - currentServerTime;
    
    console.log(`[SyncedAudio] Scheduling audio (ID: ${messageId}) to play in ${delayMs}ms`);
    
    // If we're too late, play immediately
    if (delayMs < -100) {
      console.warn(`[SyncedAudio] Audio message too old, skipping (${delayMs}ms late)`);
      return;
    }
    
    try {
      // Decode audio data
      const audioBuffer = await audioContext.decodeAudioData(audioData.slice(0));
      
      // Create audio source
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      
      // Add gain node for volume control
      const gainNode = audioContext.createGain();
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Calculate exact playback time
      const currentAudioTime = audioContext.currentTime;
      const playAtAudioTime = delayMs > 0 
        ? currentAudioTime + (delayMs / 1000)
        : currentAudioTime;
      
      // Schedule playback
      source.start(playAtAudioTime);
      
      console.log(`[SyncedAudio] Audio scheduled for ${playAtAudioTime.toFixed(3)}s (current: ${currentAudioTime.toFixed(3)}s)`);
    } catch (error) {
      console.error('[SyncedAudio] Error scheduling audio:', error);
    }
  }, [getServerTime]);
  
  // Handle incoming synced audio messages
  useEffect(() => {
    if (!socket || !isReady) return;
    
    const handleSyncedAudio = (message: AudioMessage) => {
      console.log(`[SyncedAudio] Received audio message: ${message.messageId}`);
      scheduleAudioPlayback(message.audioData, message.playAtTime, message.messageId);
    };
    
    socket.on('synced-audio', handleSyncedAudio);
    
    return () => {
      socket.off('synced-audio', handleSyncedAudio);
    };
  }, [socket, isReady, scheduleAudioPlayback]);
  
  // Periodic time re-sync (every 30 seconds)
  useEffect(() => {
    if (!socket) return;
    
    syncTime(); // Initial sync
    
    const interval = setInterval(() => {
      syncTime();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [socket, syncTime]);
  
  // Send synced audio to all devices in swarm
  const sendSyncedAudio = useCallback(async (
    audioBlob: Blob,
    delayMs: number = 1000 // Default 1s buffer for network propagation
  ) => {
    if (!socket || !isReady) {
      console.error('[SyncedAudio] Socket or audio context not ready');
      return;
    }
    
    const audioData = await audioBlob.arrayBuffer();
    const playAtTime = getServerTime() + delayMs;
    const messageId = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`[SyncedAudio] Sending audio to play at server time ${playAtTime}`);
    
    socket.emit('send-synced-audio', {
      swarmId,
      audioData,
      playAtTime,
      duration: audioBlob.size / 16000, // Rough estimate, adjust based on format
      messageId,
    });
    
    // Also schedule locally
    scheduleAudioPlayback(audioData, playAtTime, messageId);
  }, [socket, isReady, swarmId, getServerTime, scheduleAudioPlayback]);
  
  return {
    sendSyncedAudio,
    timeSync,
    isReady,
    audioContext: audioContextRef.current,
  };
}

