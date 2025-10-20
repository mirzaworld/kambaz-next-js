import { ReactNode } from "react";
import CourseNavigation from "./navigation";
import { courses } from "../../database";
import Breadcrumb from "./breadcrumb";

export default async function CoursesLayout(
  { children, params } : Readonly<{ children : ReactNode ; params : Promise<{ cid : string }> }>
) {
  const { cid } = await params;

  const course = ( Array.isArray( courses ) ? courses : [] ).find(
    ( c : any ) => String( c._id || "" ).toLowerCase() === String( cid ).toLowerCase()
  );

  return (
    <div id = "wd-courses">
      {/* Red title with breadcrumb (single header) */}
      <Breadcrumb course = { course } />

      <hr />

      <div className = "d-flex">
        <div className = "d-none d-md-block me-3">
          <CourseNavigation />
        </div>
        <div className = "flex-fill">
          { children }
        </div>
      </div>
    </div>
  );
}
