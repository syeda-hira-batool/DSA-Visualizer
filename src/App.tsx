import Background from "./MyComponents/Background";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white px-4 py-10">
      <div className="w-full max-w-3xl">
        {/* Background renders the animated "DSA VISUALIZER" heading; keep a
            real (visually hidden) h1 alongside it for accessibility & SEO. */}
        <h1 className="sr-only">DSA Visualizer</h1>
        <Background />

        <p className="mt-6 text-center text-gray-600">
          Step through data structures and algorithms one operation at a time.
        </p>
      </div>
    </div>
  );
}