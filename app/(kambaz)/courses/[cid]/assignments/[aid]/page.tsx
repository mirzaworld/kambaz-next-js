"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { assignments as allAssignments } from "../../../../database";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { updateAssignment } from "../reducer";
import type { Assignment } from "../../../../types";

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid : string ; aid : string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const all = useSelector(( state: RootState ) => ( state.assignmentsReducer )?.assignments || allAssignments );

  const assignment = ( Array.isArray( all ) ? all : [] ).find(
    ( a : Assignment ) =>
      String( a.course || "" ).toLowerCase() === String( cid ).toLowerCase() &&
      String( a._id || "" ).toLowerCase() === String( aid ).toLowerCase()
  ) as Assignment | undefined;

  const titleDefault = assignment?.title || `Assignment ${ aid }`;

  const [ title, setTitle ] = useState<string>( titleDefault );
  const [ description, setDescription ] = useState<string>( (assignment && (assignment.description || "")) || `Describe ${ titleDefault } here...` );
  const [ points, setPoints ] = useState<number>( (assignment && (assignment.points || 100)) || 100 );
  const [ group, setGroup ] = useState<string>( (assignment && (assignment as any).group) || "ASSIGNMENTS" );
  const [ displayAs, setDisplayAs ] = useState<string>( (assignment && (assignment as any).displayAs) || "Percentage" );

  useEffect(() => {
    setTitle( assignment?.title || titleDefault );
    setDescription( (assignment && (assignment.description || "")) || `Describe ${ titleDefault } here...` );
    setPoints( (assignment && (assignment.points || 100)) || 100 );
    setGroup( (assignment && (assignment as any).group) || "ASSIGNMENTS" );
    setDisplayAs( (assignment && (assignment as any).displayAs) || "Percentage" );
  }, [ assignment, aid, titleDefault ] );

  const save = () => {
    if (!assignment) return;
    const updated = {
      ...assignment,
      title,
      description,
      points,
      group,
      displayAs,
    } as unknown as Assignment;
    dispatch( updateAssignment( updated ) );
    router.push( `/courses/${ cid }/assignments` );
  };

  return (
    <div id = "wd-assignments-editor" className = "p-3" style = {{ maxWidth : 800 }}>
      <div className = "mb-3">
        <label htmlFor = "wd-name" className = "form-label"> Assignment Name </label>
        <input id = "wd-name" className = "form-control" value = { title } onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
      </div>

      <div className = "mb-3">
        <label htmlFor = "wd-description" className = "form-label"> Description </label>
        <textarea
          id = "wd-description"
          className = "form-control"
          rows = { 6 }
          value = { description }
          onChange = {(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
        />
      </div>

      <div className = "col-md-4 mb-3">
        <label htmlFor = "wd-points" className = "form-label"> Points </label>
        <input id = "wd-points" type = "number" className = "form-control" value = { points } onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setPoints(Number(e.target.value))} />
      </div>

      <div className = "col-md-4 mb-3">
        <label htmlFor = "wd-group" className = "form-label"> Assignment Group </label>
        <select id = "wd-group" className = "form-select" value = { group } onChange = {(e: React.ChangeEvent<HTMLSelectElement>) => setGroup(e.target.value)}>
          <option> ASSIGNMENTS </option>
          <option> QUIZZES </option>
          <option> EXAMS </option>
          <option> PROJECT </option>
        </select>
      </div>

      <div className = "col-md-4 mb-3">
        <label htmlFor = "wd-display-grade-as" className = "form-label"> Display Grade As </label>
        <select id = "wd-display-grade-as" className = "form-select" value = { displayAs } onChange = {(e: React.ChangeEvent<HTMLSelectElement>) => setDisplayAs(e.target.value)}>
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
        <button className = "btn btn-secondary" onClick = { () => router.back() }> Cancel </button>
        <button className = "btn btn-danger" onClick = { save }> Save </button>
      </div>
    </div>
  );
}
