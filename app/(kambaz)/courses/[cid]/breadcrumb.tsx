"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa6";

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
  { course } : { course : { name : string } | undefined }
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
        <FaAlignJustify className = "me-4 fs-4 mb-1" />
        { " " } { course?.name || "" }
        { sectionLabel ? ` > ${ sectionLabel }` : "" } { " " }
        </h2>
    );
}
