// Action icon mappings using react-icons
import { MdDirectionsRun, MdEventSeat, MdRecordVoiceOver } from 'react-icons/md';
import { GiJumpAcross, GiScreaming } from 'react-icons/gi';

export const actionIcons = {
  run: MdDirectionsRun,
  jump: GiJumpAcross,
  scream: GiScreaming,
  sit: MdEventSeat,
  shout: MdRecordVoiceOver,
};

export type ActionType = keyof typeof actionIcons;

// Placeholder for when GIFs are added
export const actionGifs: Record<string, string> = {
  run: '/gifs/actions/run.gif',
  jump: '/gifs/actions/jump.gif',
  scream: '/gifs/actions/scream.gif',
  sit: '/gifs/actions/sit.gif',
};

// Check if GIF exists, fallback to icon
export const hasGif = (action: string): boolean => {
  return action in actionGifs;
};

