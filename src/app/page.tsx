import { Hero } from "@/components/sections/Hero";
import { NoteLookup } from "@/components/notes/NoteLookup";

export default function HomePage() {
  return (
    <main className="flex min-h-[100dvh] min-h-screen flex-col safe-t">
      <Hero />
      <NoteLookup />
    </main>
  );
}
