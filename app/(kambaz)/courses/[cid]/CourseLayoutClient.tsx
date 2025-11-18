"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CourseNavigation from "./navigation";
import Breadcrumb from "./breadcrumb";

export default function CourseLayoutClient(
  { children, course } : { children : React.ReactNode; course? : { name : string; _id?: string } }
) {
  const [ visible, setVisible ] = useState<boolean>( true );
  const [currentCourse, setCurrentCourse] = useState<{ name: string; _id?: string } | undefined>(course);
  const pathname = usePathname() || "";

  const toggle = () => setVisible( v => !v );

  useEffect(() => {
    if (currentCourse) return;
    const parts = pathname.split("/").filter(Boolean);
    const cid = parts[1];
    if (!cid) return;
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_HTTP_SERVER}/api/courses`);
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        const found = data.find((c: any) => String(c._id).toLowerCase() === String(cid).toLowerCase());
        if (found) setCurrentCourse(found);
      } catch (e) {
      }
    };
    fetchCourse();
  }, [pathname, currentCourse]);

  return (
    <div>
      <Breadcrumb course = { currentCourse } onToggle = { toggle } />

      <hr />

      <div className = "d-flex">
        {/* Mobile - nav appears when toggled */}
        <div className = "d-md-none me-2">
          { visible && (
            <div className = "mt-2">
              <CourseNavigation />
            </div>
          ) }
        </div>

        {/* Desktop - visible only when `visible` is true */}
        { visible && (
          <div className = "d-none d-md-block me-3">
            <CourseNavigation />
          </div>
        ) }

        <div className = "flex-fill">
          { children }
        </div>
      </div>
    </div>
  );
}
