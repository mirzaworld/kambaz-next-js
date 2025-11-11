"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";

import ModulesControls from "./modulescontrols";
import LessonControlButtons from "./lessoncontrolbuttons";
import ModuleControlButtons from "./modulecontrolbuttons";

import { useSelector, useDispatch } from "react-redux";
import { addModule, editModule, updateModule, deleteModule } from "./reducer";
import { RootState } from "../../../store";
import type { Module, Lesson } from "../../../types";

export default function Modules() {
  const { cid } = useParams<{ cid : string }>();
  const [ moduleName, setModuleName ] = useState( "" );

  const modulesState = useSelector(( state: RootState ) => ( state.modulesReducer )?.modules || [] as Module[]);
  const dispatch = useDispatch();

  const modules = ( Array.isArray( modulesState ) ? modulesState : [] as Module[] ).filter(
    ( m : Module ) => String( m.course || "" ).toLowerCase() === String( cid ).toLowerCase()
  );

  return (
    <div>
      <ModulesControls
        moduleName = { moduleName }
        setModuleName = { setModuleName }
        addModule = { () => {
          dispatch( addModule( { name: moduleName, course: cid } ) );
          setModuleName( "" );
        } }
       /> <br /> <br /> <br /> <br />

      <ListGroup id = "wd-modules" className = "rounded-0">
        { modules.map( ( module : Module ) => (
          <ListGroupItem
            key = { module._id }
            className = "wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className = "wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
              <BsGripVertical className = "me-2 fs-3" /> { " " }

              <div className="flex-grow-1 ms-2">
                { !module.editing && (
                  <div className="text-truncate" style={{ maxWidth: '100%' }}>{ module.name }</div>
                ) }

                { module.editing && (
                  <FormControl className = "w-100"
                    onChange = {( e : React.ChangeEvent<HTMLInputElement> ) => dispatch( updateModule( { ...module, name: e.target.value } as Module ) ) }
                    onKeyDown = {( e : React.KeyboardEvent<HTMLInputElement> ) => {
                      if ( e.key === "Enter" ) {
                        dispatch( updateModule( { ...module, editing: false } as Module ) );
                      }
                    } }
                    defaultValue = { module.name }
                  />
                ) }
              </div>

              <ModuleControlButtons
                moduleId = { module._id }
                deleteModule = {( moduleId : string ) => dispatch( deleteModule( moduleId ) ) }
                editModule = {( moduleId : string ) => dispatch( editModule( moduleId ) ) }
              />
            </div>

            { module.lessons && (
              <ListGroup className = "wd-lessons rounded-0">
                { module.lessons.map( ( lesson : Lesson ) => (
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
