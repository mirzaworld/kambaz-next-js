"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import React from "react";


const labels = [ "Home", "Modules", "Zoom", "Assignments", "Quizzes", "Grades", "People" ];

const segmentOf = (label : string) => {
    switch (label) {
        case "Home" : return "home";
        case "Modules" : return "modules";
        // Piazza intentionally removed (no page implemented) to avoid 404
        case "Zoom" : return "zoom";
        case "Assignments" : return "assignments";
        case "Quizzes" : return "quizzes";
        case "Grades" : return "grades";
        case "People" : return "people/table"; // preserve your current route
        default : return label.toLowerCase();
    }
};


const idOf = (label : string) => {
    switch (label) {
        case "Home" : return "wd-course-home-link";
        case "Modules" : return "wd-course-modules-link";
        // Piazza link id removed
        case "Zoom" : return "wd-course-zoom-link";
        case "Assignments" : return "wd-course-assignments-link";
        case "Quizzes" : return "wd-course-quizzes-link";
        case "Grades" : return "wd-course-grades-link";
        case "People" : return "wd-course-people-link";
        default : return `wd-course-${ label.toLowerCase() }-link`;
    }
};

export default function CourseNavigation() {
    const pathname = ( usePathname() || "" ).toLowerCase();
    const { cid } = useParams<{ cid : string }>();

    const isActive = (label : string) => {
        const seg = segmentOf( label );
        const href = `/courses/${ cid }/${ seg }`.toLowerCase();
        if (label === "People") {
            const peopleBase = `/courses/${ cid }/people`.toLowerCase();
            return pathname === href || pathname.startsWith( peopleBase + "/" );
        }
        return pathname === href || pathname.startsWith( href + "/" );
    };

  return (
    <div id = "wd-courses-navigation" className = "wd list-group fs-5 rounded-0">

        { labels.map( (label) => {
            const seg = segmentOf( label );
            const href = `/courses/${ cid }/${ seg }`;
            const id = idOf( label );
            const cls = `list-group-item ${ isActive( label ) ? "active" : "text-danger" } border-0`;
            return (
                <React.Fragment key = { id }>
                    <Link href = { href } id = { id } className = { cls }>
                        { " " } { label } { " " }
                    </Link> <br />
                </React.Fragment>
            );
        })}
    </div>
  );
}
