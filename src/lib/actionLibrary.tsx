// Comprehensive action library for swarms
import { IconType } from 'react-icons';
import { MdDirectionsRun, MdEventSeat, MdRecordVoiceOver, MdPanTool, MdWavingHand, MdLoop } from 'react-icons/md';
import { GiJumpAcross, GiScreaming } from 'react-icons/gi';
import { FaWalking, FaHandPaper, FaHeart, FaSmile, FaSadCry, FaAngry, FaSurprise, FaHandPointUp, FaMusic } from 'react-icons/fa';
import { BsPersonArmsUp, BsPersonStanding } from 'react-icons/bs';
import { HiHandRaised } from 'react-icons/hi2';
import { IoMegaphoneOutline } from 'react-icons/io5';

export interface Action {
  id: string;
  name: string;
  category: 'movement' | 'gesture' | 'voice' | 'emotion' | 'position';
  icon: IconType;
  gifPath?: string; // Optional: path to animated GIF
  description: string;
  keywords: string[];
}

export const actionLibrary: Action[] = [
  // MOVEMENT
  {
    id: 'run',
    name: 'Run',
    category: 'movement',
    icon: MdDirectionsRun,
    gifPath: '/gifs/actions/run.gif',
    description: 'Run forward',
    keywords: ['run', 'sprint', 'fast', 'move', 'dash'],
  },
  {
    id: 'walk',
    name: 'Walk',
    category: 'movement',
    icon: FaWalking,
    gifPath: '/gifs/actions/walk.gif',
    description: 'Walk forward',
    keywords: ['walk', 'move', 'step', 'pace'],
  },
  {
    id: 'jump',
    name: 'Jump',
    category: 'movement',
    icon: GiJumpAcross,
    gifPath: '/gifs/actions/jump.gif',
    description: 'Jump up',
    keywords: ['jump', 'leap', 'hop', 'bounce'],
  },
  {
    id: 'spin',
    name: 'Spin',
    category: 'movement',
    icon: MdLoop,
    gifPath: '/gifs/actions/spin.gif',
    description: 'Spin around',
    keywords: ['spin', 'turn', 'rotate', 'twirl'],
  },
  {
    id: 'stop',
    name: 'Stop',
    category: 'movement',
    icon: FaHandPaper,
    gifPath: '/gifs/actions/stop.gif',
    description: 'Stop moving',
    keywords: ['stop', 'halt', 'freeze', 'pause'],
  },
  
  // POSITION
  {
    id: 'sit',
    name: 'Sit',
    category: 'position',
    icon: MdEventSeat,
    gifPath: '/gifs/actions/sit.gif',
    description: 'Sit down',
    keywords: ['sit', 'seated', 'rest'],
  },
  {
    id: 'stand',
    name: 'Stand',
    category: 'position',
    icon: BsPersonStanding,
    gifPath: '/gifs/actions/stand.gif',
    description: 'Stand up',
    keywords: ['stand', 'rise', 'up'],
  },
  {
    id: 'kneel',
    name: 'Kneel',
    category: 'position',
    icon: MdEventSeat,
    gifPath: '/gifs/actions/kneel.gif',
    description: 'Kneel down',
    keywords: ['kneel', 'bow', 'crouch'],
  },
  
  // GESTURES
  {
    id: 'wave',
    name: 'Wave',
    category: 'gesture',
    icon: MdWavingHand,
    gifPath: '/gifs/actions/wave.gif',
    description: 'Wave hand',
    keywords: ['wave', 'hello', 'greet', 'goodbye'],
  },
  {
    id: 'point',
    name: 'Point',
    category: 'gesture',
    icon: FaHandPointUp,
    gifPath: '/gifs/actions/point.gif',
    description: 'Point',
    keywords: ['point', 'indicate', 'show'],
  },
  {
    id: 'clap',
    name: 'Clap',
    category: 'gesture',
    icon: BsPersonArmsUp,
    gifPath: '/gifs/actions/clap.gif',
    description: 'Clap hands',
    keywords: ['clap', 'applaud', 'cheer'],
  },
  {
    id: 'raise-hand',
    name: 'Raise Hand',
    category: 'gesture',
    icon: HiHandRaised,
    gifPath: '/gifs/actions/raise-hand.gif',
    description: 'Raise your hand',
    keywords: ['raise', 'hand', 'volunteer', 'signal'],
  },
  {
    id: 'arms-up',
    name: 'Arms Up',
    category: 'gesture',
    icon: MdPanTool,
    gifPath: '/gifs/actions/arms-up.gif',
    description: 'Raise both arms',
    keywords: ['arms', 'up', 'celebrate', 'victory'],
  },
  
  // VOICE
  {
    id: 'shout',
    name: 'Shout',
    category: 'voice',
    icon: MdRecordVoiceOver,
    gifPath: '/gifs/actions/shout.gif',
    description: 'Shout out loud',
    keywords: ['shout', 'yell', 'call', 'loud'],
  },
  {
    id: 'scream',
    name: 'Scream',
    category: 'voice',
    icon: GiScreaming,
    gifPath: '/gifs/actions/scream.gif',
    description: 'Scream',
    keywords: ['scream', 'shriek', 'loud'],
  },
  {
    id: 'whistle',
    name: 'Whistle',
    category: 'voice',
    icon: IoMegaphoneOutline,
    gifPath: '/gifs/actions/whistle.gif',
    description: 'Whistle',
    keywords: ['whistle', 'sound', 'signal'],
  },
  {
    id: 'sing',
    name: 'Sing',
    category: 'voice',
    icon: FaMusic,
    gifPath: '/gifs/actions/sing.gif',
    description: 'Sing',
    keywords: ['sing', 'song', 'voice', 'music'],
  },
  
  // EMOTIONS
  {
    id: 'smile',
    name: 'Smile',
    category: 'emotion',
    icon: FaSmile,
    gifPath: '/gifs/actions/smile.gif',
    description: 'Smile',
    keywords: ['smile', 'happy', 'joy'],
  },
  {
    id: 'sad',
    name: 'Sad',
    category: 'emotion',
    icon: FaSadCry,
    gifPath: '/gifs/actions/sad.gif',
    description: 'Look sad',
    keywords: ['sad', 'cry', 'unhappy'],
  },
  {
    id: 'angry',
    name: 'Angry',
    category: 'emotion',
    icon: FaAngry,
    gifPath: '/gifs/actions/angry.gif',
    description: 'Show anger',
    keywords: ['angry', 'mad', 'upset'],
  },
  {
    id: 'surprised',
    name: 'Surprised',
    category: 'emotion',
    icon: FaSurprise,
    gifPath: '/gifs/actions/surprised.gif',
    description: 'Look surprised',
    keywords: ['surprised', 'shock', 'amazed'],
  },
  {
    id: 'love',
    name: 'Love',
    category: 'emotion',
    icon: FaHeart,
    gifPath: '/gifs/actions/love.gif',
    description: 'Show love',
    keywords: ['love', 'heart', 'like', 'care'],
  },
];

export const categories = [
  { id: 'all', name: 'All Actions', icon: '🎭' },
  { id: 'movement', name: 'Movement', icon: '🏃' },
  { id: 'position', name: 'Position', icon: '🧍' },
  { id: 'gesture', name: 'Gestures', icon: '👋' },
  { id: 'voice', name: 'Voice', icon: '🗣️' },
  { id: 'emotion', name: 'Emotions', icon: '😊' },
] as const;

export const getActionById = (id: string): Action | undefined => {
  return actionLibrary.find(action => action.id === id);
};

export const getActionsByCategory = (category: string): Action[] => {
  if (category === 'all') return actionLibrary;
  return actionLibrary.filter(action => action.category === category);
};

export const searchActions = (query: string): Action[] => {
  const lowerQuery = query.toLowerCase();
  return actionLibrary.filter(action =>
    action.name.toLowerCase().includes(lowerQuery) ||
    action.keywords.some(keyword => keyword.includes(lowerQuery))
  );
};

