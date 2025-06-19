import { useMemo, useSyncExternalStore, useEffect } from "react";

/**
 * This hook returns audio contexts for recording and playback.
 * In practice they will be the same AudioContext, except in Firefox where sample rates may differ
 * See bug tracked here: https://bugzilla.mozilla.org/show_bug.cgi?id=1725336https://bugzilla.mozilla.org/show_bug.cgi?id=1725336
 * @todo: If/when the bug is fixed, we can use the same audio context for both recording and playback
*/
export function useAudioContexts({
  recordingSampleRate = 16_000,
  playbackSampleRate = 16_000,
}) {
  const hydrated = useHydrated();
  const inputAudioContext = useMemo(
    () =>
      hydrated
        ? new window.AudioContext({ sampleRate: recordingSampleRate })
        : undefined,
    [hydrated, recordingSampleRate],
  );

  const playbackAudioContext = useMemo(() => {
    const isFirefox = typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    return isFirefox
      ? new window.AudioContext({ sampleRate: playbackSampleRate })
      : inputAudioContext;
  }, [inputAudioContext, playbackSampleRate]);

  useCleanupAudioContext(inputAudioContext);
  useCleanupAudioContext(playbackAudioContext);

  return { inputAudioContext, playbackAudioContext };
}

// Lets us know if we're rendering client side or not
const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

// Close audio context when component unmounts
function useCleanupAudioContext(context?: AudioContext) {
  useEffect(() => {
    return () => {
      if (context && context.state === 'running') {
        context.close();
      }
    };
  }, [context]);
}
