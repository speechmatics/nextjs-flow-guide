"use client";
import {
  usePCMAudioListener,
  usePCMAudioRecorderContext,
} from "@speechmatics/browser-audio-input-react";
import {
  type AgentAudioEvent,
  useFlow,
  useFlowEventListener,
} from "@speechmatics/flow-client-react";
import { usePCMAudioPlayerContext } from "@speechmatics/web-pcm-player-react";
import { type FormEventHandler, useCallback } from "react";
import { getJWT } from "@/app/actions";
import { MicrophoneSelect } from "@/components/MicrophoneSelect";

export function Controls({
  personas,
}: {
  personas: Record<string, { name: string }>;
}) {
  const {
    startConversation,
    endConversation,
    sendAudio,
    socketState,
    sessionId,
  } = useFlow();

  const { startRecording, stopRecording, audioContext } =
    usePCMAudioRecorderContext();

  const startSession = useCallback(
    async ({
      personaId,
      recordingSampleRate,
    }: {
      personaId: string;
      recordingSampleRate: number;
    }) => {
      const jwt = await getJWT("flow");

      await startConversation(jwt, {
        config: {
          template_id: personaId,
          template_variables: {
            // We can set up any template variables here
          },
        },
        audioFormat: {
          type: "raw",
          encoding: "pcm_f32le",
          sample_rate: recordingSampleRate,
        },
      });
    },
    [startConversation],
  );

  const handleSubmit = useCallback<FormEventHandler>(
    async (e) => {
      e.preventDefault();

      if (!audioContext) {
        throw new Error("Audio context not initialized!");
      }

      if (socketState === "open" && sessionId) {
        stopRecording();
        endConversation();
        return;
      }

      const formData = new FormData(e.target as HTMLFormElement);

      const personaId = formData.get("personaId")?.toString();
      if (!personaId) throw new Error("No persona selected!");

      const deviceId = formData.get("deviceId")?.toString();
      if (!deviceId) throw new Error("No device selected!");

      await startSession({
        personaId,
        recordingSampleRate: audioContext.sampleRate,
      });
      await startRecording({ deviceId });
    },
    [
      startSession,
      startRecording,
      stopRecording,
      endConversation,
      socketState,
      sessionId,
      audioContext,
    ],
  );

  const { playAudio } = usePCMAudioPlayerContext();

  usePCMAudioListener(sendAudio);
  useFlowEventListener(
    "agentAudio",
    useCallback(
      ({ data }: AgentAudioEvent) => {
        if (socketState === "open" && sessionId) {
          playAudio(data);
        }
      },
      [socketState, sessionId, playAudio],
    ),
  );

  // Disable selects when session is active.
  const disableSelects = !!sessionId;

  return (
    <section>
      <div className="card-title">
        <h3>Controls</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <MicrophoneSelect disabled={disableSelects} />
          <select name="personaId" disabled={disableSelects}>
            {Object.entries(personas).map(([id, persona]) => (
              <option key={id} value={id} label={persona.name} />
            ))}
          </select>
        </div>
        <div className="card-actions mt-4">
          <ActionButton />
          <MuteMicrophoneButton />
        </div>
      </form>
    </section>
  );
}

function ActionButton() {
  const { socketState, sessionId } = useFlow();

  if (
    socketState === "connecting" ||
    socketState === "closing" ||
    (socketState === "open" && !sessionId)
  ) {
    return (
      <button type="button" className="btn" disabled aria-busy>
        <span className="loading loading-spinner" />
      </button>
    );
  }

  const running = socketState === "open" && sessionId;
  return (
    <button type="submit" className={running ? "btn-accent" : "btn"}>
      {running ? "Stop" : "Start"}
    </button>
  );
}

function MuteMicrophoneButton() {
  const { isRecording, mute, unmute, isMuted } = usePCMAudioRecorderContext();
  if (!isRecording) return null;

  return (
    <button type="button" onClick={isMuted ? unmute : mute}>
      {isMuted ? "Unmute microphone" : "Mute microphone"}
    </button>
  );
}
