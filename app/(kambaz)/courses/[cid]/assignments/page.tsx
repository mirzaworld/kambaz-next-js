export default function assignments() {
    return (
        <div id = "wd-assignments">
            <input placeholder = "Search for Assignments"
            id = "wd-search-assignment" />
            <button id = "wd-add-assignment-group"> + Group </button>
            <button id = "wd-add-assignment"> + Assignment </button>
            <h3 id = "wd-assignments-title"> ASSIGNMENTS 40% of Total <button> + </button> </h3>
            <ul id = "wd-assignments-list">
                <li className = "wd-assignment-list-item">
                    <a href = "/courses/1234/assignment/123"
                    className = "wd-assignment-link">
                        A1 - ENV + HTML
                    </a>
                </li>
                <li className = "wd-assignment-list-item">
                    <a href = "/courses/1234/assignment/124"
                    className = "wd-assignment-link">
                        A2 - CSS + BOOTSTRAP
                    </a>
                </li>
                <li className = "wd-assignment-list-item">
                    <a href = "/courses/1234/assignment/125"
                    className = "wd-assignment-link">
                        A3 - JavaScript + REACT
                    </a>
                </li>
            </ul>
        </div>
    )
}