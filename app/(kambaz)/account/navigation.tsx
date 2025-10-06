"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountNavigation() {
  const pathname = (usePathname() || "").toLowerCase();

  const Item = (href: string, text: string, id: string) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    const cls = `list-group-item border-0 text-nowrap ${active ? "active" : "text-danger"}`;
    return (
      <Link href = {href} id = {id} className = {cls}>
        {text}
      </Link>
    );
  };

  return (
    <div id = "wd-account-navigation" className = "wd list-group fs-5 rounded-0" style = {{ minWidth: 160 }}>
      {Item("/account/signin", "Sign in", "wd-account-signin-link")}
      {Item("/account/signup", "Sign up", "wd-account-signup-link")}
      {Item("/account/profile", "Profile", "wd-account-profile-link")}
    </div>
  );
}
