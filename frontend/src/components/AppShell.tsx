import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "@/auth/AuthContext";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { CompassIcon, InboxIcon, ImageStackIcon, UserIcon, LogoutIcon, TrophyIcon } from "./icons";

interface NavItem {
  to: string;
  label: string;
  icon: (props: { className?: string }) => JSX.Element;
}

function navItemsForRole(role: string | undefined): NavItem[] {
  if (role === "BUSINESS") {
    return [
      { to: "/", label: "Discover", icon: CompassIcon },
      { to: "/business/applications", label: "Applications", icon: InboxIcon },
      { to: "/business/content", label: "Review queue", icon: ImageStackIcon },
      { to: "/business/leaderboard", label: "Leaderboard", icon: TrophyIcon },
      { to: "/business/profile", label: "Company profile", icon: UserIcon },
    ];
  }
  if (role === "CREATOR") {
    return [
      { to: "/", label: "Discover", icon: CompassIcon },
      { to: "/creator/applications", label: "My applications", icon: InboxIcon },
      { to: "/creator/content", label: "My submissions", icon: ImageStackIcon },
      { to: "/leaderboard", label: "Leaderboard", icon: TrophyIcon },
      { to: "/creator/profile", label: "My profile", icon: UserIcon },
    ];
  }
  return [{ to: "/", label: "Discover", icon: CompassIcon }];
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItemsForRole(user?.role);

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-ink-100 bg-white/70 px-5 py-6 backdrop-blur-sm">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-950 text-gold-400">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M9 21.5V10.5H18.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 16H16.5" stroke="#5E6DFB" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-ink-900">Escobar.Club</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                clsx(
                  "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-ink-950 text-paper-50" : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
                )
              }
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {user ? (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-ink-100 bg-paper-100 px-3 py-3">
            <Avatar name={user.email} size={34} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-ink-800">{user.email}</p>
              <p className="text-[11px] uppercase tracking-wide text-ink-400">{user.role.toLowerCase()}</p>
            </div>
            <button
              aria-label="Log out"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="focus-ring rounded-md p-1.5 text-ink-400 hover:bg-white hover:text-alert-500"
            >
              <LogoutIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-2 rounded-xl border border-ink-100 bg-paper-100 px-3 py-3">
            <p className="px-1 text-xs text-ink-500">Sign in to apply, review, and manage partnerships.</p>
            <Link to="/login">
              <Button size="sm" className="w-full">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" variant="secondary" className="w-full">
                Create account
              </Button>
            </Link>
          </div>
        )}
      </aside>

      <main className="min-w-0 flex-1 px-8 py-8 lg:px-12">
        <div className="mx-auto max-w-6xl animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
