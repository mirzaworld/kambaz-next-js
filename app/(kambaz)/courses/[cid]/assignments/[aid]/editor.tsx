"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { assignments as allAssignments } from "../../../../../database";

type Assignment = {
  _id : string ;
  title : string ;
  course : string ;
  description? : string ;
  points? : number ;
  dueDate? : string ;
  availableFrom? : string ;
  availableUntil? : string ;
};

export default function Editor() {
  const { cid, aid } = useParams<{ cid : string ; aid : string }>();

  const assignment : Assignment | undefined = ( Array.isArray( allAssignments ) ? allAssignments : [] ).find(
    ( a : any ) =>
      String( a.course || "" ).toLowerCase() === String( cid ).toLowerCase() &&
      String( a._id || "" ).toLowerCase() === String( aid ).toLowerCase()
  );

  const title = assignment?.title || `Assignment ${ aid }`;
  const description =
    assignment?.description ||
    `The assignment is available online. Submit a link to the landing page of your Web application running on Netlify.

The landing page should include:
• Your full name and section
• Links to each of the lab assignments
• Link to the Kambaz application
• Links to all relevant source code repositories`;
  const points = assignment?.points ?? 100;
  const dueDate = assignment?.dueDate || "2025-09-30";
  const availableFrom = assignment?.availableFrom || "2025-09-15";
  const availableUntil = assignment?.availableUntil || "2025-10-15";

  return (
    <div id = "wd-assignments-editor" className = "p-2">
      <Form>
        {/* Name */}
        <Form.Group className = "mb-3" controlId = "wd-name">
          <Form.Label> Assignment Name </Form.Label>
          <Form.Control defaultValue = { title } />
        </Form.Group>

        {/* Description */}
        <Form.Group className = "mb-3" controlId = "wd-description">
          <Form.Label> Description </Form.Label>
          <Form.Control as = "textarea" rows = { 5 } defaultValue = { description } />
        </Form.Group>


        {/* Points */}
        <div className = "row mb-3">
          <div className = "d-none d-md-flex col-md-3 col-lg-2 justify-content-end align-items-center">
            <span className = "col-form-label"> Points </span>
          </div>
          <div className = "col-12 col-md-9 col-lg-10">
            <Form.Control id = "wd-points" type = "number" defaultValue = { points } style = {{ width : "100%" }} />
          </div>
        </div>

        {/* Assignment Group */}
        <div className = "row mb-3">
          <div className = "d-none d-md-flex col-md-3 col-lg-2 justify-content-end align-items-center">
            <span className = "col-form-label"> Assignment Group </span>
          </div>
          <div className = "col-12 col-md-9 col-lg-10">
            <Form.Select id = "wd-group" defaultValue = "ASSIGNMENTS" style = {{ width : "100%" }}>
              <option> ASSIGNMENTS </option>
              <option> QUIZZES </option>
              <option> EXAMS </option>
              <option> PROJECT </option>
            </Form.Select>
          </div>
        </div>

        {/* Display Grade As */}
        <div className = "row mb-3">
          <div className = "d-none d-md-flex col-md-3 col-lg-2 justify-content-end align-items-center">
            <span className = "col-form-label"> Display Grade As </span>
          </div>
          <div className = "col-12 col-md-9 col-lg-10">
            <Form.Select id = "wd-display-grade-as" defaultValue = "Percentage" style = {{ width : "100%" }}>
              <option> Points </option>
              <option> Percentage </option>
              <option> Letter Grade </option>
              <option> GPA </option>
              <option> Complete/Incomplete </option>
            </Form.Select>
          </div>
        </div>

        <div className = "row mb-3">
          <div className = "d-none d-md-flex col-md-3 col-lg-2 justify-content-end align-items-start">
            <span className = "col-form-label"> Assign </span>
          </div>
          <div className = "col-12 col-md-9 col-lg-10">
            <div className = "border rounded p-3">
              <Form.Label htmlFor = "wd-assign-to" className = "fw-semibold"> Assign to </Form.Label>
              <Form.Control id = "wd-assign-to" className = "mb-3" defaultValue = "Everyone" />

              <div className = "row g-3">
                <div className = "col-12">
                  <Form.Label htmlFor = "wd-due-date" className = "fw-semibold"> Due </Form.Label>
                  <Form.Control id = "wd-due-date" type = "date" defaultValue = { dueDate } />
                </div>

                <div className = "col-12 col-md-6">
                  <Form.Label htmlFor = "wd-available-from" className = "fw-semibold"> Available from </Form.Label>
                  <Form.Control id = "wd-available-from" type = "date" defaultValue = { availableFrom } />
                </div>

                <div className = "col-12 col-md-6">
                  <Form.Label htmlFor = "wd-available-until" className = "fw-semibold"> Until </Form.Label>
                  <Form.Control id = "wd-available-until" type = "date" defaultValue = { availableUntil } />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className = "mt-3">
          <Button
            as = { Link }
            href = { `/courses/${ cid }/assignments` }
            variant = "secondary"
            className = "me-2"
          >
            Cancel
          </Button>
          <Button
            as = { Link }
            href = { `/courses/${ cid }/assignments` }
            variant = "danger"
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
