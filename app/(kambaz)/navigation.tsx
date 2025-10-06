"use client";
import { usePathname } from "next/navigation";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";

import Link from "next/link";

export default function KambazNavigation() {

    const pathname = (usePathname() || "").toLowerCase();

    const Item = ({
        href, id, label, icon, nonActiveTextClass = "text-white",
    }: {
        href: string;
        id: string;
        label: string;
        icon: React.ReactNode;
        nonActiveTextClass?: string;
    }) => {
        const active = pathname.startsWith(href);
        const base = "list-group-item d-block text-center text-decoration-none py-3 border-0";
        const cls = active
            ? `${base} bg-white text-danger active`
            : `${base} bg-black ${nonActiveTextClass}`;
            return (
                <Link href = { href } id = { id } className = { cls } >
                    <div className = "mb-1" > { icon } </div>
                    <span className = "text-nowrap" > { label } </span>
                </Link>
            );
    };

    return (
    <div
      id = "wd-kambaz-navigation"
      className = "list-group rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
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

      
      <Item
        href = "/account"
        id = "wd-account-link"
        label = "Account"
        icon = {<FaRegCircleUser className = "fs-2" />}
        nonActiveTextClass = "text-secondary"
      />
      <Item href = "/dashboard" id = "wd-dashboard-link" label = "Dashboard" icon = {<AiOutlineDashboard className = "fs-2 text-danger" />} />
      <Item href = "/courses/1234/home" id = "wd-course-link" label = "Courses" icon = {<LiaBookSolid className = "fs-2 text-danger" />} />
      <Item href = "/calendar" id = "wd-calendar-link" label = "Calendar" icon = {<IoCalendarOutline className = "fs-2 text-danger" />} />
      <Item href = "/inbox" id = "wd-inbox-link" label = "Inbox" icon = {<FaInbox className = "fs-2 text-danger" />} />
      <Item href = "/labs" id = "wd-labs-link" label = "Labs" icon = {<LiaCogSolid className = "fs-2 text-danger" />} />
    </div>
  );
}