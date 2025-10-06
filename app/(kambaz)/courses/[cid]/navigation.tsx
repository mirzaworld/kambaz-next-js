"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CourseNavigation() {
  
  const pathname = (usePathname() || "").toLowerCase();
  
  const parts = pathname.split("/");
  const cid = parts[2] || "1234";

  const isActive = (segment: string) => {
    const href = `/courses/${cid}/${segment}`;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div id = "wd-courses-navigation" className = "wd list-group fs-5 rounded-0">

        <Link href = {`/courses/${cid}/home`} id = "wd-course-home-link" className = {`list-group-item ${isActive("home") ? "active" : "text-danger"} border-0`}>
            Home
        </Link> <br />

        <Link
            href = {`/courses/${cid}/modules`}
            id = "wd-course-modules-link"
            className = {`list-group-item ${isActive("modules") ? "active" : "text-danger"} border-0`}>
                Modules
        </Link> <br />

        <Link
            href = {`/courses/${cid}/piazza`}
            id = "wd-course-piazza-link"
            className = {`list-group-item ${isActive("piazza") ? "active" : "text-danger"} border-0`}>
                Piazza
        </Link> <br />

        <Link
            href = {`/courses/${cid}/zoom`}
            id = "wd-course-zoom-link"
            className = {`list-group-item ${isActive("zoom") ? "active" : "text-danger"} border-0`}>
                Zoom
        </Link> <br />

        <Link
            href = {`/courses/${cid}/assignments`}
            id = "wd-course-assignments-link"
            className = {`list-group-item ${isActive("assignments") ? "active" : "text-danger"} border-0`}>
                Assignments
        </Link> <br />

        <Link
            href = {`/courses/${cid}/quizzes`}
            id = "wd-course-quizzes-link"
            className = {`list-group-item ${isActive("quizzes") ? "active" : "text-danger"} border-0`}>
                Quizzes
        </Link> <br />

        <Link
            href = {`/courses/${cid}/grades`}
            id = "wd-course-grades-link"
            className = {`list-group-item ${isActive("grades") ? "active" : "text-danger"} border-0`}>
                Grades
        </Link> <br />

        <Link
            href = {`/courses/${cid}/people/table`}
            id = "wd-course-people-link"
            className = {`list-group-item ${pathname.startsWith(`/courses/${cid}/people`) ? "active" : "text-danger"} border-0`}>
                People
        </Link> <br />
        </div>
    );
}
