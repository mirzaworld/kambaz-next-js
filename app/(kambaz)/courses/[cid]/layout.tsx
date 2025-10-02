import { ReactNode } from "react";
import CourseNavigation from "./navigation";
import { FaAlignJustify } from "react-icons/fa";

export default async function CoursesLayout(
    { children, params}: { children: ReactNode; params: Promise < { cid: string } > }) {
    const { cid } = await params;
    return (
        <div id = "wd-courses">
            <h2 className = "text-danger" >
                Course {cid}
            </h2>
            <hr />
            <div className ="d-flex">
                <div className = "d-none d-md-block">
                    <CourseNavigation />
                </div>
                <div className = "flex-fill">
                    { children }
                </div>
            </div>
        </div>
    );
}
