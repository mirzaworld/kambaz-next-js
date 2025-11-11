"use client";

import React, { useState } from "react";
import CourseNavigation from "./navigation";
import Breadcrumb from "./breadcrumb";

export default function CourseLayoutClient(
  { children, course } : { children : React.ReactNode; course? : { name : string } }
) {
  // default visible so desktop shows navigation; toggle will hide/show on all sizes
  const [ visible, setVisible ] = useState<boolean>( true );

  const toggle = () => setVisible( v => !v );

  return (
    <div>
      {/* Breadcrumb/header is now rendered inside the client wrapper so its toggle can control nav */}
      <Breadcrumb course = { course } onToggle = { toggle } />

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
