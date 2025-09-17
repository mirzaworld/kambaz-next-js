export default function Modules() {
    return (
        <div>
            <button id = "wd-collapse-all"> Collapse All </button>
            <button id = "wd-view-progress"> View Progress </button>
            <select id = "wd-publish-status">
                <option value = "all"> Publish all </option>
                <option value = "published"> Published </option>
            </select>
            <button id = "wd-add-module"> + Module </button>
            <ul id = "wd-modules">
                <li className = "wd-module">
                    <div className = "wd-title"> Week 1 </div>
                    <ul className = "wd-lessons">
                        <li className = "wd-lesson">
                            <span className = "wd-title"> LEARNING OBJECTIVES </span>
                            <ul className = "wd-content">
                                <li className = "wd-content-item"> Introduction to the course </li>
                                <li className = "wd-content-item"> Learn what is Web Development </li>
                            </ul>
                            <li className = "wd-lesson"> READING </li>
                            <ul className = "wd-content">
                                <li className = "wd-content-item"> Full Stack Developer - Chapter 1 - Introduction </li>
                                <li className = "wd-content-item"> Full Stack Developer - Chapter 2 - Creating Us </li>
                        
                            </ul>
                            <li className = "wd-title"> SLIDES </li>
                            <ul className = "wd-content">
                                <li className = "wd-content-item"> Introduction to Web Development </li>
                                <li className = "wd-content-item"> Creating an HTTP server with Node.js </li>
                                <li className = "wd-content-item"> Creating a Reat Application </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className = "wd-module">
                    <div className = "wd-title"> Week 2 </div>
                    <ul className = "wd-lessons"> 
                        <li className = "wd-lesson"> 
                            <span className = "wd-title"> LEARNING OBJECTIVES </span>
                            <ul className = "wd-content">
                                <li className = "wd-content-item"> Lwearn how to create user interfa e with HTML </li>
                                <li className = "wd-content-item"> Deploy the assignment to Netlify </li>
                            </ul>
                            <li className = "wd-lesson"> SLIDES </li>
                            <ul className = "wd-content">
                                <li className = "wd-content-item"> Introduction to HTML and the DOM </li>
                                <li className = "wd-content-item"> Formatting Web content with Headings </li>
                                <li className = "wd-content-item"> Formatting content with Lists and Tables </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className = "wd-module" >
                    <div className = "wd-title-content"> Week 3 </div>
                    <ul className = "wd-lessons"> 
                        <li className = "wd-lesson"> 
                            <span className = "wd-title"> LEARNING OBJECTIVES </span>
                            <ul className = "wd-content">
                                <li className = "wd-content-item"> Learn how to style web pages with CSS </li>
                                <li className = "wd-content-item"> Learn how to use Flexbox and Grid </li>
                            </ul>
                            <li className = "wd-lesson"> SLIDES </li>
                            <ul className = "wd-content">
                                <li className = "wd-content-item"> Introduction to CSS </li>
                                <li className = "wd-content-item"> CSS Box Model </li>
                                <li className = "wd-content-item"> CSS Flexbox and Grid </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}