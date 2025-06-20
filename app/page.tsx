// highlight-start
import { fetchPersonas } from "@speechmatics/flow-client-react";
import { Controls } from "@/components/Controls";
import { Status } from "@/components/Status";
import { TranscriptView } from "@/components/TranscriptView";
// highlight-end
import { Providers } from "./providers";

export default async function Home() {
  // highlight-start
  const personas = await fetchPersonas();
  // highlight-end

  return (
    <main>
      <h1>Speechmatics NextJS Flow Example</h1>
      <Providers>
        {/* highlight-start */}
        <div className="flex flex-col gap-4 h-full min-h-0">
          <div className="flex flex-row gap-2">
            <Controls personas={personas} />
            <Status />
          </div>
          <TranscriptView />
        </div>
        {/* highlight-end */}
      </Providers>
    </main>
  );
}
