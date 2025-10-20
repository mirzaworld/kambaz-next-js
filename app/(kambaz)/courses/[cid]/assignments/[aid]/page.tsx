"use client";

import { useParams } from "next/navigation";
import { assignments as allAssignments } from "../../../../database";

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid : string ; aid : string }>();

  const assignment = ( Array.isArray( allAssignments ) ? allAssignments : [] ).find(
    ( a : any ) =>
      String( a.course || "" ).toLowerCase() === String( cid ).toLowerCase() &&
      String( a._id || "" ).toLowerCase() === String( aid ).toLowerCase()
  );

  const title = assignment?.title || `Assignment ${ aid }`;

  return (
    <div id = "wd-assignments-editor" className = "p-3" style = {{ maxWidth : 800 }}>
      <div className = "mb-3">
        <label htmlFor = "wd-name" className = "form-label"> Assignment Name </label>
        <input id = "wd-name" className = "form-control" defaultValue = { title } />
      </div>

      <div className = "mb-3">
        <label htmlFor = "wd-description" className = "form-label"> Description </label>
        <textarea
          id = "wd-description"
          className = "form-control"
          rows = { 6 }
          defaultValue = { `Describe ${ title } here...` }
        />
      </div>

      <div className = "col-md-4 mb-3">
        <label htmlFor = "wd-points" className = "form-label"> Points </label>
        <input id = "wd-points" type = "number" className = "form-control" defaultValue = { 100 } />
      </div>

      <div className = "col-md-4 mb-3">
        <label htmlFor = "wd-group" className = "form-label"> Assignment Group </label>
        <select id = "wd-group" className = "form-select" defaultValue = "ASSIGNMENTS">
          <option> ASSIGNMENTS </option>
          <option> QUIZZES </option>
          <option> EXAMS </option>
          <option> PROJECT </option>
        </select>
      </div>

      <div className = "col-md-4 mb-3">
        <label htmlFor = "wd-display-grade-as" className = "form-label"> Display Grade As </label>
        <select id = "wd-display-grade-as" className = "form-select" defaultValue = "Percentage">
          <option> Points </option>
          <option> Percentage </option>
          <option> Letter Grade </option>
          <option> GPA </option>
          <option> Complete/Incomplete </option>
        </select>
      </div>

      <div className = "border rounded p-3 mb-3">
        <div className = "fw-semibold mb-2"> Assign </div>
        <div className = "mb-3">
          <label htmlFor = "wd-assign-to" className = "form-label"> Assign to </label>
          <input id = "wd-assign-to" className = "form-control" defaultValue = "Everyone" />
        </div>
        <div className = "row g-3 mb-3">
          <div className = "col-md-6">
            <label htmlFor = "wd-due-date" className = "form-label"> Due </label>
            <input id = "wd-due-date" type = "date" className = "form-control" />
          </div>
        </div>
        <div className = "row g-3">
          <div className = "col-md-6">
            <label htmlFor = "wd-available-from" className = "form-label"> Available from </label>
            <input id = "wd-available-from" type = "date" className = "form-control" />
          </div>
          <div className = "col-md-6">
            <label htmlFor = "wd-available-until" className = "form-label"> Until </label>
            <input id = "wd-available-until" type = "date" className = "form-control" />
          </div>
        </div>
      </div>

      <div className = "d-flex justify-content-end gap-2">
        <button className = "btn btn-secondary"> Cancel </button>
        <button className = "btn btn-danger"> Save </button>
      </div>
    </div>
  );
}
