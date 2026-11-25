import type { Metadata } from "next";
import DashboardShell from "@/app/component/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard | CantoX",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
