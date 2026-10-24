import { useSyncExternalStore } from 'react';
import { resolvedPeople } from '../config/layout';
import { AudioController, type PlaybackState } from './AudioController';

/** The single audio controller used by the whole app. */
export const audio = new AudioController(new Map(resolvedPeople.map((p) => [p.id, p.soundUrl])));

/**
 * Subscribe to a slice of the playback state. Return a primitive from the
 * selector so a component only re-renders when *its* slice changes.
 */
export function usePlayback<T>(selector: (s: PlaybackState) => T): T {
  return useSyncExternalStore(audio.subscribe, () => selector(audio.getState()));
}
