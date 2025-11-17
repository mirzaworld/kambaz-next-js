"use client";
import React, { useEffect, useState } from "react";
import * as client from "./client";

export default function WorkingWithObjectsAsynchronously() {
  const [assignment, setAssignment] = useState<any>({});
  const fetchAssignment = async () => {
    const a: any = await client.fetchAssignment();
    setAssignment(a);
  };
  useEffect(() => {
    fetchAssignment();
  }, []);
  const updateTitle = async (title: string) => {
    const updatedAssignment: any = await client.updateTitle(title);
    setAssignment(updatedAssignment);
  };
  return (
    <div id="wd-asynchronous-objects">
      <h3>Working with Objects Asynchronously</h3>
      <h4>Assignment</h4>
      <input
        id="wd-assignment-title"
        className="w-75 mb-2"
        defaultValue={assignment.title}
        onChange={(e: any) => setAssignment({ ...assignment, title: e.target.value })}
      />
      <input
        id="wd-assignment-description"
        className="w-100 mb-2"
        defaultValue={assignment.description}
        onChange={(e: any) => setAssignment({ ...assignment, description: e.target.value })}
      />
      <input
        id="wd-assignment-due"
        type="date"
        className="mb-2"
        defaultValue={assignment.due}
        onChange={(e: any) => setAssignment({ ...assignment, due: e.target.value })}
      />
      <div className="form-check form-switch">
        <input
          id="wd-assignment-completed"
          className="form-check-input"
          type="checkbox"
          defaultChecked={assignment.completed}
          onChange={(e: any) => setAssignment({ ...assignment, completed: e.target.checked })}
        />
        <label className="form-check-label" htmlFor="wd-assignment-completed">
          Completed
        </label>
      </div>
      <button id="wd-update-assignment-title" className="btn btn-primary ms-2" onClick={() => updateTitle(assignment.title)}>
        Update Title
      </button>
      <pre>{JSON.stringify(assignment, null, 2)}</pre>
      <hr />
    </div>
  );
}
