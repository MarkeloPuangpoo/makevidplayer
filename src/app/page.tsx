import VideoPlayer from "@/components/VideoPlayer";

export default function Home() {
  // Free test stream from Big Buck Bunny or similar
  const testStream = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-8 font-sans">
      <header className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Custom HLS Player
        </h1>
        <p className="text-gray-400">
          Next.js + Tailwind + Hls.js + "Stats for Nerds"
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <VideoPlayer
          src={testStream}
          poster="https://image.mux.com/x36xhzz/thumbnail.jpg?time=0"
        />

        <div className="mt-8 text-sm text-gray-500 text-center max-w-lg mx-auto">
          <p>
            Hover over the player to see controls. Click the
            <span className="inline-block mx-1 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg></span>
            icon to toggle the real-time diagnostic overlay.
          </p>
        </div>
      </main>
    </div>
  );
}
