"use client";
import React, { useState } from "react";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function WorkingWithObjects() {
  const [ assignmentTitle, setAssignmentTitle ] = useState( "NodeJS Assignment" );
  const [ moduleName, setModuleName ] = useState( "Intro Module" );
  const [ moduleDescription, setModuleDescription ] = useState( "Introduction to the course" );
  const [ assignmentScore, setAssignmentScore ] = useState( 0 );
  const [ assignmentCompleted, setAssignmentCompleted ] = useState( false );
  const ASSIGNMENT_API_URL = `${ HTTP_SERVER }/lab5/assignment`;
  const MODULE_API_URL = `${ HTTP_SERVER }/lab5/module`;
  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
      <h4>Retrieving Objects</h4>
      <a id="wd-retrieve-assignments" className="btn btn-primary" href={ ASSIGNMENT_API_URL }>Get Assignment</a>
      <a id="wd-retrieve-module" className="btn btn-primary ms-2" href={ MODULE_API_URL }>Get Module</a>
      <hr />
      <h4>Retrieving Properties</h4>
      <a id="wd-retrieve-assignment-title" className="btn btn-primary" href={`${ ASSIGNMENT_API_URL }/title`}>Get Title</a>
      <a id="wd-retrieve-module-name" className="btn btn-primary ms-2" href={`${ MODULE_API_URL }/name`}>Get Module Name</a>
      <hr />
      <h4>Modifying Properties</h4>
      <input id="wd-assignment-title" className="w-75" defaultValue={ assignmentTitle } onChange={ ( e ) => setAssignmentTitle( e.target.value ) } />
      <a id="wd-update-assignment-title" className="btn btn-primary ms-2" href={`${ ASSIGNMENT_API_URL }/title/${ assignmentTitle }`}>Update Title</a>
      <hr />
      <h4>Modify Assignment Score</h4>
      <input id="wd-assignment-score" type="number" className="w-25" defaultValue={ assignmentScore } onChange={ ( e ) => setAssignmentScore( parseInt( e.target.value || '0' ) ) } />
      <a id="wd-update-assignment-score" className="btn btn-primary ms-2" href={`${ ASSIGNMENT_API_URL }/score/${ assignmentScore }`}>Update Score</a>
      <hr />
      <h4>Modify Assignment Completed</h4>
      <input id="wd-assignment-completed" type="checkbox" checked={ assignmentCompleted } onChange={ ( e ) => setAssignmentCompleted( e.target.checked ) } />
      <a id="wd-update-assignment-completed" className="btn btn-primary ms-2" href={`${ ASSIGNMENT_API_URL }/completed/${ assignmentCompleted }`}>Update Completed</a>
      <hr />
      <h4>Module Properties</h4>
      <input id="wd-module-name" className="w-75" defaultValue={ moduleName } onChange={ ( e ) => setModuleName( e.target.value ) } />
      <a id="wd-update-module-name" className="btn btn-primary ms-2" href={`${ MODULE_API_URL }/name/${ moduleName }`}>Update Module Name</a>
      <hr />
      <h4>Module Description</h4>
      <input id="wd-module-description" className="w-100" defaultValue={ moduleDescription } onChange={ ( e ) => setModuleDescription( e.target.value ) } />
      <a id="wd-update-module-description" className="btn btn-primary ms-2" href={`${ MODULE_API_URL }/description/${ moduleDescription }`}>Update Module Description</a>
      <hr />
    </div>
  );
}
