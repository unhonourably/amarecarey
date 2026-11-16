import { AdminGuestbook } from "@/components/admin/AdminGuestbook";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata = {
  title: "Guestbook admin",
  robots: { index: false, follow: false },
};

export default async function CanesGuestbookPage() {
  await requireAdminPage();

  return (
    <main className="min-h-[100dvh] min-h-screen overflow-x-hidden py-6 safe-x safe-t safe-b sm:py-16">
      <div className="section-shell">
        <AdminGuestbook />
      </div>
    </main>
  );
}