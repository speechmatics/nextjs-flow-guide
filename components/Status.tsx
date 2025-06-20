"use client";
import { usePCMAudioRecorderContext } from "@speechmatics/browser-audio-input-react";
import { useFlow } from "@speechmatics/flow-client-react";

export function Status() {
  const { socketState, sessionId } = useFlow();
  const { isRecording } = usePCMAudioRecorderContext();

  return (
    <section>
      <h3>Status</h3>
      <dl>
        <dt>🔌 Socket is</dt>
        <dd>{socketState ?? "(uninitialized)"}</dd>
        <dt>💬 Session ID</dt>
        <dd>{sessionId ?? "(none)"}</dd>
        <dt>🎤 Microphone is</dt>
        <dd>{isRecording ? "recording" : "not recording"}</dd>
      </dl>
    </section>
  );
}
