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

const StatusItem = ({ status, result }: { status: string; result: string }) => {
  return (
    <div className="flex">
      <p className="w-1/2">{status}: </p>
      <p className="w-1/2">{result}</p>
    </div>
  );
};
