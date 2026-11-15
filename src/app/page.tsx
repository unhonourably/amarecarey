import { Hero } from "@/components/sections/Hero";
import { NoteLookup } from "@/components/notes/NoteLookup";
import { CommentsSection } from "@/components/comments/CommentsSection";

export default function HomePage() {
  return (
    <main className="flex min-h-[100dvh] min-h-screen flex-col overflow-x-hidden safe-t pb-[max(4.75rem,env(safe-area-inset-bottom))] sm:pb-8">
      <Hero />
      <NoteLookup />
      <CommentsSection compact />
    </main>
  );
}