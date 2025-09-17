export default function AssignmentEditor() {
    return (
        <div id = "wd-assignment-editor">
            <label htmlFor = "wd-name"> Assignment Name </label>
            <input id = "wd-name" value = "A1 - ENV + HTML" /> <br /> <br />
            <textarea id = "wd-description"> 
                The assignment is available online. <br />
                Submit a link to the landing page of your Web application running on Netlify <br />

                <ul>
                    The landing page should include the following:
                    <li> Your full name and section </li>
                    <li> Links to each of the lab assignments </li>
                    <li> Links to the Kambaz application </li>
                    <li> Links to all relevant source code repositories </li>

                    The Kambaz application should include a link to navigate back to the landing page.
                </ul>
            </textarea>
            <br />
            <table>
                <tr>
                    <td align = "right" valign = "top">
                        <label htmlFor = "wd-points"> Points </label>
                    </td>
                    <td>
                        <input id = "wd-points" value = {100} />
                    </td>
                </tr>
                <tr>
                    <td align = "right" valign = "top">
                        <label htmlFor = "wd-assignment-group"> Assignment Group </label>
                    </td>
                    <td>
                        <select id = "wd-assignment-group">
                            <option value = "1"> Assignments 40% of Total </option>
                            <option value = "2"> Quizzes 20% of Total </option>
                            <option value = "3"> Labs 30% of Total </option>
                            <option value = "4"> Projects 10% of Total </option>
                        </select>
                    </td>
                </tr>
            </table>
        </div>
    );
}