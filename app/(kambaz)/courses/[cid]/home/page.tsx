import Modules from "../modules/page";
import CourseStatus from "./status";

export default function home() {
    return (
        <div id = "wd-home">
            <table>
                <tbody>
                    <tr>
                        <td valign = "top" width = "70%"> < Modules /> </td>
                        <td valign = "top" width = "30%"> < CourseStatus /> </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}