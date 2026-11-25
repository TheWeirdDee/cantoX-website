"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarDays,
  Cake,
  ChevronDown,
  ChevronRight,
  Copy,
  LayoutGrid,
  ListChecks,
  LogOut,
  Menu,
  PanelLeft,
  Sparkles,
  Store,
  Users,
  X,
} from "lucide-react";
import { signOut, useStore } from "@/app/lib/wedding-store";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/overview", icon: LayoutGrid },
  { label: "Events", href: "/dashboard/events", icon: Cake },
  { label: "Templates", href: "/dashboard/templates", icon: Copy },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Sparkles },
  { label: "Guests", href: "/dashboard/guests", icon: Users },
  { label: "Vendors", href: "/dashboard/vendors", icon: Store },
  { label: "To-do list", href: "/dashboard/to-do-list", icon: ListChecks },
  { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
];

const SECTION_TITLES: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map((item) => [item.href.split("/")[2], item.label])
);

/** The editor takes the whole page next to the sidebar, so no header or content card */
const isStudioPath = (pathname: string) => /^\/dashboard\/templates\/[^/]+\/edit/.test(pathname);

function Sidebar({
  pathname,
  collapsed,
  onToggle,
  onNavigate,
}: {
  pathname: string;
  collapsed: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-[#060D18] text-white">
      <div className={`flex items-center py-5 ${collapsed ? "justify-center px-2" : "justify-between pl-5 pr-3"}`}>
        {!collapsed && (
          <Link href="/dashboard/templates" onClick={onNavigate} aria-label="Canto dashboard">
            <Image src="/canto-white.svg" alt="Canto" width={92} height={25} priority />
          </Link>
        )}
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav aria-label="Dashboard" className="mt-3 flex flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              title={collapsed ? label : undefined}
              className={`flex h-11 items-center gap-3 rounded-md px-3 text-[14px] transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-white/10 font-medium text-white"
                  : "text-[#8D95A5] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function UserMenu({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-[52px] items-center gap-3 rounded-md border border-[#E6E9EF] bg-white px-2 pr-3 transition-colors hover:bg-[#F8F9FB]"
      >
        {email === "precious.a@canto.app" ? (
          <Image
            src="/dashboard/avatar.png"
            alt=""
            width={152}
            height={152}
            className="h-[38px] w-[38px] rounded-full object-cover"
          />
        ) : (
          <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#C99532] text-[13px] font-semibold text-white">
            {initials}
          </span>
        )}
        <span className="hidden text-[14px] font-medium text-[#060D18] sm:block">{name}</span>
        <ChevronDown className="h-4 w-4 text-[#060D18]" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-56 rounded-md border border-[#E6E9EF] bg-white p-1 shadow-lg"
        >
          <p className="truncate px-3 py-2 text-[12px] text-[#6B7280]">{email}</p>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              signOut();
              router.replace("/get-started");
            }}
            className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-[14px] text-[#171A20] hover:bg-[#F1F5F9]"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

/** Needs a session; visiting the public site ends it (see Navbar) */
export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const state = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const studio = isStudioPath(pathname);

  useEffect(() => {
    if (state.ready && !state.session) router.replace("/get-started");
  }, [state.ready, state.session, router]);

  useEffect(() => setDrawerOpen(false), [pathname]);

  if (!state.ready || !state.session) {
    return <div className="min-h-screen bg-[#F1F4F9]" aria-busy="true" />;
  }

  const section = pathname.split("/")[2] ?? "";
  const title = SECTION_TITLES[section] ?? "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F4F9]">
      {/* Desktop sidebar */}
      <aside
        className={`hidden shrink-0 transition-[width] duration-200 lg:block ${
          collapsed ? "w-[72px]" : "w-[256px]"
        }`}
      >
        <Sidebar
          pathname={pathname}
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside
            className="absolute left-0 top-0 h-full w-[256px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar pathname={pathname} collapsed={false} onNavigate={() => setDrawerOpen(false)} />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-5 text-white/80"
            >
              <X className="h-5 w-5" />
            </button>
          </aside>
        </div>
      )}

      {studio ? (
        <div className="relative min-w-0 flex-1">
          {children}
        </div>
      ) : (
        <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
          <header className="flex shrink-0 items-center justify-between gap-3 rounded-md bg-white px-3 py-2 sm:px-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                className="flex h-9 w-9 items-center justify-center rounded-md text-[#060D18] hover:bg-[#F1F5F9] lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[14px]">
                <Link href="/dashboard/overview" className="hidden items-center gap-2 text-[#6B7A99] sm:flex">
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
                <ChevronRight className="hidden h-3.5 w-3.5 text-[#9CA3AF] sm:block" />
                <span className="font-medium text-[#060D18]">{title}</span>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Notifications"
                className="relative flex h-[52px] w-[52px] items-center justify-center rounded-md border border-[#E6E9EF] bg-white hover:bg-[#F8F9FB]"
              >
                <Bell className="h-5 w-5 text-[#060D18]" />
                <span className="absolute right-3.5 top-3.5 h-2 w-2 rounded-full bg-[#E5484D]" />
              </button>
              <UserMenu name={state.session.name} email={state.session.email} />
            </div>
          </header>

          <main className="min-h-0 flex-1 rounded-md bg-white p-4 sm:p-6">{children}</main>
        </div>
      )}
    </div>
  );
}
