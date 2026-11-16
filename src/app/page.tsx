import { Hero } from "@/components/sections/Hero";
import { HomeActionStack } from "@/components/home/HomeActionStack";
import { NoteLookup } from "@/components/notes/NoteLookup";

export default function HomePage() {
  return (
    <main className="flex min-h-[100dvh] min-h-screen flex-col overflow-x-hidden safe-t pb-[max(5.75rem,env(safe-area-inset-bottom))] sm:pb-8">
      <Hero />
      <NoteLookup />
      <HomeActionStack />
    </main>
  );
}