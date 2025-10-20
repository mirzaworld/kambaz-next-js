"use client";

import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";

import ModulesControls from "./modulescontrols";
import LessonControlButtons from "./lessoncontrolbuttons";
import ModuleControlButtons from "./modulecontrolbuttons";

import { modules as allModules } from "../../../database";

export default function Modules() {
  const { cid } = useParams<{ cid : string }>();

  const modules = ( Array.isArray( allModules ) ? allModules : [] ).filter(
    ( m : any ) => String( m.course || "" ).toLowerCase() === String( cid ).toLowerCase()
  );

  return (
    <div>
      <ModulesControls /> <br /> <br /> <br /> <br />

      <ListGroup id = "wd-modules" className = "rounded-0">
        { modules.map( ( module : any ) => (
          <ListGroupItem
            key = { module._id }
            className = "wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className = "wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className = "me-2 fs-3" /> { " " } { module.name } { " " }
              <ModuleControlButtons />
            </div>

            { module.lessons && (
              <ListGroup className = "wd-lessons rounded-0">
                { module.lessons.map( ( lesson : any ) => (
                  <ListGroupItem
                    key = { lesson._id }
                    className = "wd-lesson p-3 ps-1"
                  >
                    <BsGripVertical className = "me-2 fs-3" /> { " " } { lesson.name } { " " }
                    <LessonControlButtons />
                  </ListGroupItem>
                ) ) }
              </ListGroup>
            ) }
          </ListGroupItem>
        ) ) }
      </ListGroup>
    </div>
  );
}
