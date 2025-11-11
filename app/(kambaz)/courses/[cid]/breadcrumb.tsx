"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa";

const labelMap : Record<string, string> = {
  home : "Home",
  modules : "Modules",
  piazza : "Piazza",
  zoom : "Zoom",
  assignments : "Assignments",
  quizzes : "Quizzes",
  grades : "Grades",
  people : "People",
};

export default function Breadcrumb(
  { course, onToggle } : { course : { name : string } | undefined; onToggle? : () => void }
) {
    const pathname = ( usePathname() || "" ).toLowerCase();

    const parts = pathname.split( "/" ).filter( Boolean );


    let section = parts[2] || "";


    if ( parts[2] === "people" ) {
        section = "people";
    }

    const sectionLabel =
        labelMap[ section ] ||
        ( section ? section[0]?.toUpperCase() + section.slice( 1 ) : "" );

    return (
        <h2 className = "text-danger">
        <FaAlignJustify
          className = "me-4 fs-4 mb-1"
          role = "button"
          style = {{ cursor: onToggle ? "pointer" : "default" }}
          onClick = { () => onToggle && onToggle() }
          aria-controls = "wd-courses-navigation"
        />
        { " " } { course?.name || "" }
        { sectionLabel ? ` > ${ sectionLabel }` : "" } { " " }
        </h2>
    );
}
