import { AdminAma } from "@/components/admin/AdminAma";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata = {
  title: "AMA admin",
  robots: { index: false, follow: false },
};

export default async function CanesAskPage() {
  await requireAdminPage();

  return (
    <main className="min-h-[100dvh] min-h-screen overflow-x-hidden py-6 safe-x safe-t safe-b sm:py-16">
      <div className="section-shell">
        <AdminAma />
      </div>
    </main>
  );
}