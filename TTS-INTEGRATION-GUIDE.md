# Text-to-Speech Integration Guide

## ✅ Yes! All voices are native Web Speech API

The TTS demo uses **100% native browser voices** - completely free and offline-capable:
- **iOS/Safari**: 40-80 high-quality Siri voices
- **Android/Chrome**: 10-30 Google TTS voices  
- **macOS**: 60-90 voices
- **Windows**: 10-20 voices
- **Linux**: 5-15 voices

**Zero cost, no API keys, works offline!** 🎉

---

## 🚀 Quick Integration into Chat Project

### Method 1: Use the React Hook (Recommended)

```tsx
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

function ChatMessage({ message }) {
  const { speak, stop, isSpeaking, voices } = useTextToSpeech();

  return (
    <div>
      <p>{message.text}</p>
      <button onClick={() => speak(message.text)}>
        {isSpeaking ? '⏹️ Stop' : '🔊 Speak'}
      </button>
    </div>
  );
}
```

### Method 2: Use the Service Directly

```tsx
import { getTTSService } from '@/lib/textToSpeech';

async function speakMessage(text: string) {
  const tts = getTTSService();
  await tts.speak(text, {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
  });
}
```

### Method 3: Quick One-Liner

```tsx
import { speak } from '@/lib/textToSpeech';

// Simplest possible usage
await speak("Hello world!");
```

---

## 💬 Chat-Specific Integration Examples

### Example 1: Read Aloud Button

```tsx
function ChatMessage({ message }) {
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const [isThisMessageSpeaking, setIsThisMessageSpeaking] = useState(false);

  const handleSpeak = async () => {
    if (isThisMessageSpeaking) {
      stop();
      setIsThisMessageSpeaking(false);
      return;
    }

    setIsThisMessageSpeaking(true);
    await speak(message.text, {
      onEnd: () => setIsThisMessageSpeaking(false)
    });
  };

  return (
    <div className="message">
      <p>{message.text}</p>
      <button onClick={handleSpeak}>
        {isThisMessageSpeaking ? '⏹️' : '🔊'}
      </button>
    </div>
  );
}
```

### Example 2: Auto-Speak Bot Messages

```tsx
function ChatContainer() {
  const { speak } = useTextToSpeech();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    
    // Auto-speak bot responses
    if (lastMessage && lastMessage.sender === 'bot') {
      speak(lastMessage.text);
    }
  }, [messages, speak]);

  return <div>{/* ... chat UI ... */}</div>;
}
```

### Example 3: Word-by-Word Highlighting

```tsx
function ChatMessage({ message }) {
  const { speak, currentWord } = useTextToSpeech();
  const [highlightedText, setHighlightedText] = useState(message.text);

  const handleSpeak = () => {
    speak(message.text, {
      onWord: (word, index) => {
        // Highlight the current word
        const before = message.text.substring(0, index);
        const after = message.text.substring(index + word.length);
        setHighlightedText(
          `${before}<mark>${word}</mark>${after}`
        );
      },
      onEnd: () => setHighlightedText(message.text)
    });
  };

  return (
    <div>
      <p dangerouslySetInnerHTML={{ __html: highlightedText }} />
      <button onClick={handleSpeak}>🔊 Read Aloud</button>
    </div>
  );
}
```

### Example 4: Voice Selection per User

```tsx
function UserSettings() {
  const { voices } = useTextToSpeech();
  const [userVoice, setUserVoice] = useState<string>('');

  // Save to localStorage or user profile
  const handleVoiceChange = (voiceName: string) => {
    setUserVoice(voiceName);
    localStorage.setItem('preferredVoice', voiceName);
  };

  return (
    <select onChange={(e) => handleVoiceChange(e.target.value)}>
      {voices.map(voice => (
        <option key={voice.name} value={voice.name}>
          {voice.name} ({voice.lang})
        </option>
      ))}
    </select>
  );
}

// Then in your chat:
function ChatMessage({ message }) {
  const { speak, voices } = useTextToSpeech();
  const preferredVoice = localStorage.getItem('preferredVoice');

  const handleSpeak = () => {
    const voice = voices.find(v => v.name === preferredVoice);
    speak(message.text, { voice });
  };

  return <button onClick={handleSpeak}>🔊</button>;
}
```

### Example 5: Speed Reading Mode

```tsx
function SpeedReader({ text }) {
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const [speed, setSpeed] = useState(1.5);

  return (
    <div>
      <p>{text}</p>
      <input
        type="range"
        min="0.5"
        max="3"
        step="0.1"
        value={speed}
        onChange={(e) => setSpeed(parseFloat(e.target.value))}
      />
      <span>{speed}x speed</span>
      <button onClick={() => speak(text, { rate: speed })}>
        {isSpeaking ? '⏹️ Stop' : '▶️ Speed Read'}
      </button>
    </div>
  );
}
```

---

## 🎨 UI Patterns for TTS in Chat

### Pattern 1: Inline Speaker Button

```tsx
<div className="message">
  <div className="message-content">{message.text}</div>
  <button className="tts-btn" onClick={() => speak(message.text)}>
    🔊
  </button>
</div>
```

### Pattern 2: Context Menu

```tsx
<div 
  className="message"
  onContextMenu={(e) => {
    e.preventDefault();
    showMenu([
      { label: 'Copy', action: copy },
      { label: 'Speak', action: () => speak(message.text) },
      { label: 'Translate', action: translate }
    ]);
  }}
>
  {message.text}
</div>
```

### Pattern 3: Floating Action Button

```tsx
function ChatWindow() {
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()?.toString();
      setSelectedText(selection || '');
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  return (
    <>
      {/* Chat messages */}
      {selectedText && (
        <button 
          className="floating-tts"
          onClick={() => speak(selectedText)}
        >
          🔊 Speak Selection
        </button>
      )}
    </>
  );
}
```

---

## 🌍 Multi-Language Support

```tsx
function MultilingualChat({ message }) {
  const { speak, voices } = useTextToSpeech();

  // Auto-detect language and use appropriate voice
  const speakInLanguage = (text: string, lang: string) => {
    const voice = voices.find(v => v.lang.startsWith(lang));
    speak(text, { voice, lang });
  };

  return (
    <div>
      <p>{message.text}</p>
      <div className="language-buttons">
        <button onClick={() => speakInLanguage(message.text, 'en')}>
          🇺🇸 English
        </button>
        <button onClick={() => speakInLanguage(message.text, 'es')}>
          🇪🇸 Spanish
        </button>
        <button onClick={() => speakInLanguage(message.text, 'fr')}>
          🇫🇷 French
        </button>
      </div>
    </div>
  );
}
```

---

## 🎯 Advanced Features

### Queue Multiple Messages

```tsx
function ChatQueue({ messages }) {
  const { speak } = useTextToSpeech();

  const speakAll = async () => {
    for (const message of messages) {
      await speak(message.text);
      // Small pause between messages
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return <button onClick={speakAll}>🔊 Read All</button>;
}
```

### Accessibility Mode

```tsx
function AccessibleChat() {
  const { speak } = useTextToSpeech();
  const [autoSpeak, setAutoSpeak] = useState(false);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        const selected = window.getSelection()?.toString();
        if (selected) speak(selected);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [speak]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={autoSpeak}
          onChange={(e) => setAutoSpeak(e.target.checked)}
        />
        Auto-read messages (Accessibility)
      </label>
    </div>
  );
}
```

---

## 📱 Mobile Considerations

### iOS/Safari Requirements

```tsx
// iOS requires user interaction to start audio
function IOSFriendlyChat() {
  const { speak } = useTextToSpeech();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize on first user interaction
  const initializeTTS = () => {
    if (!isInitialized) {
      speak(''); // Silent utterance to initialize
      setIsInitialized(true);
    }
  };

  return (
    <div onClick={initializeTTS}>
      {/* Your chat UI */}
    </div>
  );
}
```

---

## 🎨 Example: Full-Featured Chat Component

See the complete example in: `/src/components/ChatWithTTS.tsx`

This includes:
- ✅ Voice selection dropdown
- ✅ Speak/stop buttons per message
- ✅ Visual feedback while speaking
- ✅ Word-by-word highlighting
- ✅ Keyboard shortcuts
- ✅ Mobile-friendly
- ✅ Accessibility support

---

## 🔧 Configuration Options

### All Available Options

```tsx
await speak("Hello world", {
  // Voice selection
  voice: voices[0],              // Specific voice object
  voiceName: "Samantha",         // Or by name
  lang: "en-US",                 // Or by language
  
  // Speech properties
  rate: 1.5,                     // Speed (0.1 to 10)
  pitch: 1.2,                    // Pitch (0 to 2)
  volume: 0.8,                   // Volume (0 to 1)
  
  // Callbacks
  onStart: () => console.log('Started'),
  onEnd: () => console.log('Finished'),
  onWord: (word, index) => console.log('Speaking:', word),
  onError: (error) => console.error(error)
});
```

---

## 🚀 Quick Start Checklist

1. ✅ **Import the hook**: `import { useTextToSpeech } from '@/hooks/useTextToSpeech'`
2. ✅ **Add to component**: `const { speak, voices } = useTextToSpeech()`
3. ✅ **Add button**: `<button onClick={() => speak(text)}>🔊</button>`
4. ✅ **Test on device**: Real devices have better voices than emulators

---

## 💡 Pro Tips

1. **Cache voice preference**: Store user's favorite voice in localStorage
2. **Use local voices**: Filter for `voice.localService` for offline capability
3. **Handle errors gracefully**: Not all devices have all voices
4. **Respect user preference**: Add a "disable TTS" option
5. **Test on real devices**: iOS has amazing voices, emulators don't show them all

---

## 🎯 Why Web Speech API is Awesome

- ✅ **Free**: No API costs or limits
- ✅ **Offline**: Works without internet (local voices)
- ✅ **Private**: Text never leaves the device
- ✅ **Fast**: Instant playback (<100ms latency)
- ✅ **Quality**: iOS Siri voices are excellent
- ✅ **Cross-platform**: Works everywhere
- ✅ **No setup**: No API keys or configuration needed

---

## 📚 Additional Resources

- **Live Demo**: http://localhost:3000/tts-demo
- **API Docs**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **Browser Support**: https://caniuse.com/speech-synthesis
- **Voice Guide**: See BROWSER-APIS-MOBILE.md (Text-to-Speech section)

---

Need help? Check out the working example at `/src/components/ChatWithTTS.tsx` 🚀


