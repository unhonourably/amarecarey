import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { isAdminAuthenticated } from "@/lib/admin/session";

export const metadata = {
  title: "Admin login",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CanesLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/canes");
  }

  return <AdminLogin />;
}
