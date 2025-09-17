export default function Editor() {
  return (
    <div id = "wd-assignments-editor">
        <label htmlFor = "wd-name" > 
            <h4>Assignment Name </h4> </label>
        <input id = "wd-name" defaultValue = "A1 - ENV + HTML" /> <br /> <br />

        <label htmlFor = "wd-description" > Description </label> <br />
        <textarea
        id = "wd-description" defaultValue ="The assignment is available online.
        Submit a link to the landing page of your Web application running on Netlify.
        
        The landing page should include:
        Your full name and section
        Links to each of the lab assignments
        Link to the Kambaz application
        Links to all relevant source code repositories.
        "/>
        <br />
       
        <table>
            <tbody>
                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr>
                    <td align = "right" valign = "top" >
                        <label htmlFor = "wd-points" > Points </label>
                    </td>
                    <td>
                        <input id = "wd-points" type = "number" defaultValue = {100} /> 
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr>
                    <td align = "right" valign = "top" >
                        <label htmlFor = "wd-group"> Assignment Group </label>
                    </td>
                    <td>
                        <select id = "wd-group" defaultValue= "ASSIGNMENTS">
                            <option> ASSIGNMENTS </option>
                            <option> QUIZZES </option>
                            <option> EXAMS </option>
                            <option> PROJECT </option>
                        </select>
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>


                <tr>
                    <td align="right" valign="top">
                        <label htmlFor = "wd-display-grade-as" > Display Grade As </label>
                    </td>
                    <td>
                        <select id = "wd-display-grade-as" defaultValue = "Percentage" >
                            <option> Points </option>
                            <option> Percentage </option>
                            <option> Letter Grade </option>
                            <option> GPA </option>
                            <option> Complete/Incomplete </option>
                        </select>
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr>
                    <td align = "right" valign = "top" >
                        <label htmlFor = "wd-submission-type" > Submission Type </label>
                    </td>
                    <td>
                        <select id = "wd-submission-type" defaultValue = "Online" >
                            <option> Online </option>
                            <option> On Paper </option>
                            <option> External Tool </option>
                        </select>
                        <br />
                        <br />
                        <span> Online Entry Options: </span> <br />

                        <input type = "checkbox" id = "wd-text-entry" defaultChecked />
                        <label htmlFor = "wd-text-entry" > Text Entry </label><br />

                        <input type = "checkbox" id = "wd-website-url" />
                        <label htmlFor = "wd-website-url" > Website URL </label><br />

                        <input type = "checkbox" id = "wd-media-recordings" />
                        <label htmlFor = "wd-media-recordings"> Media Recordings </label><br />

                        <input type = "checkbox" id = "wd-student-annotation" />
                        <label htmlFor = "wd-student-annotation" > Student Annotation </label><br />

                        <input type = "checkbox" id = "wd-file-upload" />
                        <label htmlFor = "wd-file-upload" > File Uploads </label><br />
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>


                <tr>
                    <td align = "right" valign = "top" >
                        <label htmlFor = "wd-assign-to" > Assign To </label>
                    </td>
                    <td>
                        <input id = "wd-assign-to" defaultValue = "Everyone" />
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr className = "wd-spacer-row" >
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>


                <tr>
                    <td align = "right" valign = "top" >
                        <label htmlFor = "wd-due-date" > Due </label>
                    </td>
                    <td>
                        <input id = "wd-due-date" type = "date" defaultValue = "2025-09-30" />
                    </td>
                </tr>


                <tr className = "wd-spacer-row">
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr className = "wd-spacer-row">
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr className = "wd-spacer-row">
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>

                <tr>
                    <td align = "right" valign = "top" >
                        <label htmlFor="wd-available-from"> Available From </label>
                    </td>
                    <td>
                        <input id="wd-available-from" type="date" defaultValue="2025-09-15" />
                    </td>
                    <td valign = "top" align = "center" >
                        <label htmlFor="wd-available-until">Available Until</label>
                    </td>
                    <td>
                        <input id = "wd-available-until" type = "date" defaultValue = "2025-10-15" />
                    </td>
                </tr>
            </tbody>
        </table>

        <br />
        <br />
        <button className = "wd-cancel" style = {{ float: 'right' }} > Cancel </button>

        <button className = "wd=save" style = {{ float: 'right' }} > Save </button>
    </div>
  );
}
