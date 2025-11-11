import { ReactNode } from "react";
import { courses } from "../../database";
import type { Course } from "../../types";
import CourseLayoutClient from "./CourseLayoutClient";

export default async function CoursesLayout(
  { children, params } : Readonly<{ children : ReactNode ; params : Promise<{ cid : string }> }>
) {
  const { cid } = await params;

  const course = ( Array.isArray( courses ) ? courses : [] ).find(
    ( c : Course ) => String( c._id || "" ).toLowerCase() === String( cid ).toLowerCase()
  );

  return (
    <div id = "wd-courses">
      {/* Client-side wrapper handles breadcrumb, header and responsive nav toggle */}
      <CourseLayoutClient course={ course }>
        { children }
      </CourseLayoutClient>
    </div>
  );
}
