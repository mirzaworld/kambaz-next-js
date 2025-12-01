"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";

import ModulesControls from "./modulescontrols";
import LessonControlButtons from "./lessoncontrolbuttons";
import ModuleControlButtons from "./modulecontrolbuttons";

import { useSelector, useDispatch } from "react-redux";
import { editModule, updateModule, setModules } from "./reducer";
import { RootState } from "../../../store";
import type { Module, Lesson } from "../../../types";
import * as client from "./client";

export default function Modules() {
  const { cid } = useParams<{ cid : string }>();
  const [ moduleName, setModuleName ] = useState( "" );

  const { modules } = useSelector(( state: RootState ) => ( state.modulesReducer ) || { modules: [] as Module[] });
  const dispatch = useDispatch();

  const filteredModules = Array.isArray( modules ) ? modules : [] as Module[];

  const onUpdateModule = async ( module: any ) => {
    await client.updateModule( cid, module );
    const newModules = modules.map( ( m: any ) =>
      m._id === module._id ? module : m
    );
    dispatch( setModules( newModules ) );
  };
  const onAddModule = async () => {
    const created = await client.createModuleForCourse( String( cid ), { name: moduleName } );
    const newModules = [ ...( modules || [] ), created ];
    dispatch( setModules( newModules ) );
    setModuleName( "" );
  };
  const onDeleteModule = async ( moduleId: string ) => {
    await client.deleteModule( cid, moduleId );
    const newModules = ( modules || [] ).filter( ( m: Module ) => m._id !== moduleId );
    dispatch( setModules( newModules ) );
  };

  useEffect(() => {
    const load = async () => {
      if (!cid) return;
      const serverModules = await client.findModulesForCourse(String(cid));
      dispatch(setModules(serverModules));
    };
    load();
  }, [cid, dispatch]);

  return (
    <div>
      <ModulesControls
        moduleName = { moduleName }
        setModuleName = { setModuleName }
        addModule = { onAddModule }
       /> <br /> <br /> <br /> <br />

      <ListGroup id = "wd-modules" className = "rounded-0">
        { filteredModules.map( ( module : Module ) => (
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
                        onUpdateModule( { ...module, editing: false } as Module );
                      }
                    } }
                    value = { module.name }
                  />
                ) }
              </div>

              <ModuleControlButtons
                moduleId = { module._id }
                deleteModule = {( moduleId : string ) => onDeleteModule( moduleId ) }
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
