import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata = {
  title: "Notes admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CanesPage() {
  await requireAdminPage();

  return (
    <main className="min-h-[100dvh] min-h-screen py-8 safe-x safe-t safe-b sm:py-16">
      <div className="section-shell">
        <AdminDashboard />
      </div>
    </main>
  );
}
