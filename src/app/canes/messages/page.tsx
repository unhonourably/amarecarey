import { AdminMessages } from "@/components/admin/AdminMessages";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata = {
  title: "Messages",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CanesMessagesPage() {
  await requireAdminPage();

  return (
    <main className="min-h-[100dvh] min-h-screen overflow-x-hidden py-6 safe-x safe-t safe-b sm:py-16">
      <div className="section-shell">
        <AdminMessages />
      </div>
    </main>
  );
}