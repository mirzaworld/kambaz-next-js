import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

export default function PeopleTable() {
  return (
    <div id = "wd-people-table" >
      <Table striped>
        <thead>
          <tr>
            <th>Name</th><th>Login ID</th><th>Section</th>
            <th>Role</th><th>Last Activity</th><th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className = "wd-full-name text-nowrap">
              <FaUserCircle className = "me-2 fs-1 text-secondary"/>
              <span className = "wd-first-name">Tony</span>{" "}
              <span className = "wd-last-name">Stark</span>
            </td>
            <td className = "wd-login-id">001234561S</td>
            <td className = "wd-section">S101</td>
            <td className = "wd-role">STUDENT</td>
            <td className = "wd-last-activity">2020-10-01T00:00:00.00.000Z</td>
            <td className = "wd-total-activity">10:21:32</td>
          </tr>

           <tr>
            <td className = "wd-full-name text-nowrap">
              <FaUserCircle className = "me-2 fs-1 text-secondary" />
              <span className = "wd-first-name">Bruce</span>{" "}
              <span className = "wd-last-name">Wayne</span>
            </td>
            <td className = "wd-login-id">001234562S</td>
            <td className = "wd-section">S101</td>
            <td className = "wd-role">STUDENT</td>
            <td className = "wd-last-activity">2020-10-05T00:00:00.00.000Z</td>
            <td className = "wd-total-activity">08:14:07</td>
          </tr>

          <tr>
            <td className = "wd-full-name text-nowrap">
              <FaUserCircle className = "me-2 fs-1 text-secondary" />
              <span className = "wd-first-name">Steve</span>{" "}
              <span className = "wd-last-name">Rogers</span>
            </td>
            <td className = "wd-login-id">001234563S</td>
            <td className = "wd-section">S101</td>
            <td className = "wd-role">STUDENT</td>
            <td className = "wd-last-activity">2020-10-07T00:00:00.00.000Z</td>
            <td className = "wd-total-activity">06:02:11</td>
          </tr>

          <tr>
            <td className = "wd-full-name text-nowrap">
              <FaUserCircle className = "me-2 fs-1 text-secondary" />
              <span className = "wd-first-name">Natasha</span>{" "}
              <span className = "wd-last-name">Romanoff</span>
            </td>
            <td className = "wd-login-id">001234564S</td>
            <td className = "wd-section">S101</td>
            <td className = "wd-role">TA</td>
            <td className = "wd-last-activity">2020-10-08T00:00:00.00.000Z</td>
            <td className = "wd-total-activity">15:33:54</td>
          </tr>

          <tr>
            <td className = "wd-full-name text-nowrap">
              <FaUserCircle className = "me-2 fs-1 text-secondary" />
              <span className = "wd-first-name">Thor</span>{" "}
              <span className = "wd-last-name">Odinson</span>
            </td>
            <td className = "wd-login-id">001234565S</td>
            <td className = "wd-section">S101</td>
            <td className = "wd-role">FACULTY</td>
            <td className = "wd-last-activity">2020-10-08T00:00:00.00.000Z</td>
            <td className = "wd-total-activity">15:20:18</td>
          </tr>

          <tr>
            <td className = "wd-full-name text-nowrap">
              <FaUserCircle className = "me-2 fs-1 text-secondary" />
              <span className = "wd-first-name">Bruce</span>{" "}
              <span className = "wd-last-name">Banner</span>
            </td>
            <td className = "wd-login-id">001234566S</td>
            <td className = "wd-section">S101</td>
            <td className = "wd-role">TA</td>
            <td className = "wd-last-activity">2020-10-08T00:00:00.00.000Z</td>
            <td className = "wd-total-activity">15:18:54</td>
          </tr>

          <tr>
            <td className = "wd-full-name text-nowrap">
              <FaUserCircle className = "me-2 fs-1 text-secondary" />
              <span className = "wd-first-name">Mirza</span>{" "}
              <span className = "wd-last-name">Baig</span>
            </td>
            <td className = "wd-login-id">001234567S</td>
            <td className = "wd-section">S101</td>
            <td className = "wd-role">TA</td>
            <td className = "wd-last-activity">2020-10-08T00:00:00.00.000Z</td>
            <td className = "wd-total-activity">15:11:54</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
