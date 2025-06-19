import { Providers } from "./providers";

export default async function Home() {
  return (
    <main className="h-screen container mx-auto py-6">
      <h1 className="text-2xl font-bold">Speechmatics NextJS Flow Example</h1>
      <Providers>
        {/* Our app components here will have access to provided functionality */}
      </Providers>
    </main>
  );
}
