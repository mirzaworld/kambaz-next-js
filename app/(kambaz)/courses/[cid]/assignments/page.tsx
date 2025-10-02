import Link from "next/link";

export default function Assignments() {
  return (
    <div id="wd-assignments" className="p-2">
      <input placeholder="Search for Assignments" id="wd-search-assignment" className="me-2"/>
      <button id="wd-add-assignment-group" className="btn btn-secondary me-2">+ Group</button>
      <button id="wd-add-assignment" className="btn btn-danger">+ Assignment</button>

      <h3 id="wd-assignments-title" className="mt-3">
        ASSIGNMENTS 40% of Total <button className="btn btn-light ms-2">+</button>
      </h3>

      <ul id="wd-assignment-list" className="list-group">
        <li className="wd-assignment-list-item list-group-item">
          <Link href="/courses/1234/assignments/123" className="wd-assignment-link text-danger text-decoration-none">
            A1 - ENV + HTML
          </Link>
        </li>
        <li className="wd-assignment-list-item list-group-item">
          <Link href="/courses/1234/assignments/124" className="wd-assignment-link text-danger text-decoration-none">
            A2 - CSS + BOOTSTRAP
          </Link>
        </li>
        <li className="wd-assignment-list-item list-group-item">
          <Link href="/courses/1234/assignments/125" className="wd-assignment-link text-danger text-decoration-none">
            A3 - JavaScript + REACT
          </Link>
        </li>
      </ul>
    </div>
  );
}
