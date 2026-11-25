import Link from "next/link";
import { notFound } from "next/navigation";

const SECTIONS: Record<string, string> = {
  overview: "Overview",
  events: "Events",
  wishlist: "Wishlist",
  guests: "Guests",
  vendors: "Vendors",
  "to-do-list": "To-do list",
  calendar: "Calendar",
};

/** Sidebar destinations that are not built yet */
export default function DashboardSectionPage({ params }: { params: { section: string } }) {
  const title = SECTIONS[params.section];
  if (!title) notFound();

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-[28px] text-[#060D18]">{title}</h1>
      <p className="mt-2 max-w-[360px] text-[14px] text-[#6B7280]">
        This part of the dashboard is coming soon.
      </p>
      <Link
        href="/dashboard/templates"
        className="mt-5 rounded-[4px] bg-[#C99532] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#B78628]"
      >
        Go to Templates
      </Link>
    </div>
  );
}
