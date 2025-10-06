export default function AssignmentEditor() {
  return (
    <div id = "wd-assignments-editor" className = "p-3" style = {{ maxWidth: 800 }}>
      
      <div className = "mb-3">
        <label htmlFor = "wd-name" className = "form-label">Assignment Name</label>
        <input id = "wd-name" className = "form-control" defaultValue = "A1" />
      </div>

      
      <div className = "mb-3">
        <label htmlFor = "wd-description" className = "form-label">Description</label>
        <textarea
          id = "wd-description"
          className = "form-control"
          rows = {6}
          defaultValue = {`The assignment is available online.
          Submit a link to the landing page of your Web application running on Netlify.

          The landing page should include the following:
          - Your full name and section
          - Links to each of the lab assignments
          - Link to the Kambaz application
          - Links to all relevant source code repositories

          The Kambaz application should include a link to navigate back to the landing page.`}
        />
      </div>

      
      
      <div className = "col-md-4 mb-3">
        <label htmlFor = "wd-points" className = "form-label">Points</label>
        <input id = "wd-points" type = "number" className = "form-control" defaultValue = {100} />
      </div>
      <div className = "col-md-4 mb-3 ">
        <label htmlFor = "wd-group" className = "form-label">Assignment Group</label>
        <select id = "wd-group" className = "form-select" defaultValue = "ASSIGNMENTS">
          <option>ASSIGNMENTS</option>
          <option>QUIZZES</option>
          <option>EXAMS</option>
          <option>PROJECT</option>
        </select>
      </div>
      <div className = "col-md-4 mb-3">
        <label htmlFor = "wd-display-grade-as" className = "form-label">Display Grade As</label>
        <select id = "wd-display-grade-as" className = "form-select" defaultValue = "Percentage">
          <option>Points</option>
          <option>Percentage</option>
          <option>Letter Grade</option>
          <option>GPA</option>
          <option>Complete/Incomplete</option>
        </select>
      </div>
      

      
      <div className = "border rounded p-3 mb-3">
        <label htmlFor = "wd-submission-type" className = "form-label">Submission Type</label>
        <select id = "wd-submission-type" className = "form-select" defaultValue = "Online">
          <option>Online</option>
          <option>On Paper</option>
          <option>External Tool</option>
        </select>

        <div className = "mt-3">
          <div className = "fw-semibold mb-2">Online Entry Options</div>

          <div className = "form-check mb-1">
            <input className = "form-check-input" type = "checkbox" id = "wd-text-entry" />
            <label className = "form-check-label" htmlFor = "wd-text-entry">Text Entry</label>
          </div>

          <div className = "form-check mb-1">
            <input className = "form-check-input" type = "checkbox" id = "wd-website-url" />
            <label className = "form-check-label" htmlFor = "wd-website-url">Website URL</label>
          </div>

          <div className = "form-check mb-1">
            <input className = "form-check-input" type = "checkbox" id = "wd-media-recordings" />
            <label className = "form-check-label" htmlFor = "wd-media-recordings">Media Recordings</label>
          </div>

          <div className = "form-check mb-1">
            <input className = "form-check-input" type = "checkbox" id = "wd-student-annotation" />
            <label className = "form-check-label" htmlFor = "wd-student-annotation">Student Annotation</label>
          </div>

          <div className = "form-check mb-1">
            <input className = "form-check-input" type = "checkbox" id = "wd-file-upload" />
            <label className = "form-check-label" htmlFor = "wd-file-upload">File Uploads</label>
          </div>
        </div>
      </div>

      
      <div className = "border rounded p-3 mb-3">
        <div className = "fw-semibold mb-2">Assign</div>

        <div className = "mb-3">
          <label htmlFor = "wd-assign-to" className = "form-label">Assign to</label>
          <input id = "wd-assign-to" className = "form-control" defaultValue = "Everyone" />
        </div>

        <div className = "row g-3 mb-3">
          <div className = "col-md-6">
            <label htmlFor = "wd-due-date" className = "form-label">Due</label>
            <input id = "wd-due-date" type = "date" className = "form-control" defaultValue = "2025-09-30" />
          </div>
        </div>

        <div className = "row g-3">
          <div className = "col-md-6">
            <label htmlFor = "wd-available-from" className = "form-label">Available from</label>
            <input id = "wd-available-from" type = "date" className = "form-control" defaultValue = "2025-09-15" />
          </div>
          <div className = "col-md-6">
            <label htmlFor = "wd-available-until" className = "form-label">Until</label>
            <input id = "wd-available-until" type = "date" className = "form-control" defaultValue = "2025-10-15" />
          </div>
        </div>
      </div>

      
      <div className = "d-flex justify-content-end gap-2">
        <button className = "btn btn-secondary">Cancel</button>
        <button className = "btn btn-danger">Save</button>
      </div>
    </div>
  );
}
