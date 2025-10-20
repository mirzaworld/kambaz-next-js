"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";

export default function KambazNavigation() {
  const pathname = (usePathname() || "").toLowerCase();
  const tab = (useSearchParams().get("tab") || "").toLowerCase();

  const links = [
    { id: "wd-dashboard-link", label: "Dashboard", href: "/dashboard?tab=dashboard", icon: <AiOutlineDashboard className="fs-2 text-danger" />, activeTab: "dashboard" },
    { id: "wd-course-link",    label: "Courses",   href: "/dashboard?tab=courses",   icon: <LiaBookSolid className="fs-2 text-danger" />,       activeTab: "courses"   },
    { id: "wd-calendar-link",  label: "Calendar",  href: "/calendar",                icon: <IoCalendarOutline className="fs-2 text-danger" />                          },
    { id: "wd-inbox-link",     label: "Inbox",     href: "/inbox",                   icon: <FaInbox className="fs-2 text-danger" />                                  },
    { id: "wd-labs-link",      label: "Labs",      href: "/labs",                    icon: <LiaCogSolid className="fs-2 text-danger" />                               },
  ];

  const base = "list-group-item d-block text-center text-decoration-none py-3 border-0";
  const nonActive = "bg-black text-white";

  const isActive = (href: string, activeTab?: string) => {
    if (activeTab) return tab === activeTab; 
    const hrefLower = href.toLowerCase();
    return pathname === hrefLower || pathname.startsWith(hrefLower + "/");
  };

  return (
    <div
      id = "wd-kambaz-navigation"
      className = "list-group rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-3"
      style = {{ width: 120 }}
    >
      <a
        className = "list-group-item bg-black border-0 text-center"
        target = "_blank"
        id = "wd-neu-link"
        href = "https://www.northeastern.edu/"
      >
        <img src = "/images/NEU.png" width = "75" alt = "Northeastern University" />
      </a>

      <Link
        href = "/account"
        id = "wd-account-link"
        className = {
          (pathname.startsWith("/account")
            ? `${base} bg-white text-danger active`
            : `${base} bg-black text-secondary`)
        }
      >
        <div className = "mb-1"><FaRegCircleUser className = "fs-2" /></div>
        <span className = "text-nowrap"> Account </span>
      </Link>

      {links.map(({ id, label, href, icon, activeTab }) => {
        const active = isActive(href, activeTab);
        const cls = active ? `${base} bg-white text-danger active` : `${base} ${nonActive}`;
        return (
          <Link key = {id} href = {href} id = {id} className = {cls}>
            <div className = "mb-1"> {icon} </div>
            <span className = "text-nowrap"> {label} </span>
          </Link>
        );
      })}
    </div>
  );
}
