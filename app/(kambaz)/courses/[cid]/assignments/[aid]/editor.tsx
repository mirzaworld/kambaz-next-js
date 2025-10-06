'use client';

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function Editor() {
  return (
    <div id = "wd-assignments-editor" className = "p-2">
      <Form>
        <Form.Group className = "mb-3" controlId = "wd-name">
          <Form.Label> Assignment Name </Form.Label>
          <Form.Control defaultValue = "A1 - ENV + HTML" />
        </Form.Group>

        <Form.Group className = "mb-3" controlId = "wd-description">
          <Form.Label> Description </Form.Label>
          <Form.Control as = "textarea" rows = {5} defaultValue = {
        `The assignment is available online. Submit a link to the landing page of your Web application running on Netlify.

          The landing page should include:
          • Your full name and section
          • Links to each of the lab assignments
          • Link to the Kambaz application
          • Links to all relevant source code repositories`
          }/>
        </Form.Group>

        <table className = "table w-auto">
          <tbody>
            <tr>
              <td className = "text-end align-top">
                <label htmlFor = "wd-points" className = "col-form-label">
                  Points
                </label>
              </td>

              <td>
                <Form.Control id = "wd-points" defaultValue = {100} />
              </td>
            </tr>

            <tr>
              <td className = "text-end align-top">
                <label htmlFor = "wd-group" className = "col-form-label">
                  Assignment Group
                </label>
              </td>
              
              <td>
                <Form.Select id = "wd-group" defaultValue = "ASSIGNMENTS">
                  <option>ASSIGNMENTS</option>
                  <option>QUIZZES</option>
                  <option>EXAMS</option>
                  <option>PROJECT</option>
                </Form.Select>
              </td>
            </tr>

            <tr>
              <td className = "text-end align-top">
                <label htmlFor = "wd-display-grade-as" className = "col-form-label">
                  Display Grade As
                </label>
              </td>
              
              <td>
                <Form.Select id = "wd-display-grade-as" defaultValue = "Points">
                  <option>Points</option>
                  <option>Percentage</option>
                  <option>Letter Grade</option>
                  <option>GPA</option>
                  <option>Complete/Incomplete</option>
                </Form.Select>
              </td>
            </tr>

            <tr>
              <td className = "text-end align-top">
                <label htmlFor = "wd-submission-type" className = "col-form-label">
                  Submission Type
                </label>
              </td>
              
              <td>
                <Form.Select id = "wd-submission-type" defaultValue = "Online" className = "mb-2">
                  <option>Online</option>
                  <option>On Paper</option>
                  <option>External Tool</option>
                </Form.Select>

                <div>
                  <Form.Check id = "wd-text-entry" label = "Text Entry" />
                  <Form.Check id = "wd-website-url" label = "Website URL" />
                  <Form.Check id = "wd-media-recordings" label = "Media Recordings" />
                  <Form.Check id = "wd-student-annotation" label = "Student Annotation" />
                  <Form.Check id = "wd-file-upload" label = "File Uploads" />
                </div>
              </td>
            </tr>

            <tr>
              <td className = "text-end align-top">
                <label htmlFor = "wd-assign-to" className = "col-form-label">
                  Assign To
                </label>
              </td>
              
              <td>
                <Form.Control id = "wd-assign-to" defaultValue = "Everyone" />
              </td>
            </tr>

            <tr>
              <td className = "text-end align-top">
                <label htmlFor = "wd-due-date" className = "col-form-label">
                  Due
                </label>
              </td>
              <td>
                <Form.Control id = "wd-due-date" type = "date" defaultValue = "2025-09-30" />
              </td>
            </tr>

            <tr>
              <td className = "text-end align-top">
                <label htmlFor = "wd-available-from" className = "col-form-label">
                  Available From
                </label>
              </td>
              <td>
                <Form.Control id = "wd-available-from" type = "date" defaultValue = "2025-09-15" />
              </td>
            </tr>

            <tr>
              <td className = "text-end align-top">
                <label htmlFor = "wd-available-until" className = "col-form-label">
                  Available Until
                </label>
              </td>
              <td>
                <Form.Control id = "wd-available-until" type = "date" defaultValue = "2025-10-15" />
              </td>
            </tr>
          </tbody>
        </table>

        <div className = "mt-3">
          <Button variant = "secondary" className = "me-2">
            Cancel
          </Button>
          <Button variant = "primary">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
