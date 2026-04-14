import Diagnosis from "./diagnosis";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center bg-[#0a0a0a] min-h-screen">
      <div className="w-full max-w-md mx-auto px-5 py-6 pb-12">
        <Diagnosis />
      </div>
    </main>
  );
}
