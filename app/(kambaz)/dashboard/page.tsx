import Link from "next/link";
import Image from "next/image";

export default function dashboard() {
    return (
        <div id = "wd-dashboard">
            <h1 id = "wd-dashboard-title"> Dashboard </h1> <hr />
            <h2 id = "wd-dashboard-published"> Published Courses </h2> <hr />

            {/* Courses: 1 */}
            <div id = "wd-dashboard-courses">
                <div className = "wd-dashboard-course">
                    <Link href = "/courses/1234" className = "wd-dashboard-course-link">
                    <Image src = "/images/reactjs.jpg" width = {200} height = {150} alt = "React JS course thumbnail" />
                    <div>
                        <h5> CS1234 React JS </h5>
                        <p className = "wd-dashboard-course-title"> Full Stack Software Developer
                        </p>
                        <button> Go </button>
                    </div>
                    </Link>
                </div>

                {/* Courses: 2 */}
                <div className = "wd-dashboard-course">
                    <Link href = "/courses/1235" className = "wd-dashboard-course-link">
                    <Image src = "/images/python.jpg" width = {200} height = {150} alt = "Python course thumbnail" />
                    <div>
                        <h5> CS1235 Python </h5>
                        <p className = "wd-dashboard-course-title"> Data Science and Machine Learning
                        </p>
                        <button> Go </button>
                    </div>
                    </Link>
                </div>

                {/* Courses: 3 */}
                <div className = "wd-dashboard-course">
                    <Link href = "/courses/1236" className = "wd-dashboard-course-link">
                    <Image src = "/images/javascript.jpg" width = {200} height = {150} alt = "JavaScript course thumbnail" />
                    <div>
                        <h5> CS1236 JavaScript </h5>
                        <p className = "wd-dashboard-course-title"> Frontend Web Development
                        </p>
                        <button> Go </button>
                    </div>
                    </Link>
                </div>

                {/* Courses: 4 */}
                <div className = "wd-dashboard-course">
                    <Link href = "/courses/1237" className = "wd-dashboard-course-link">
                    <Image src = "/images/java.jpg" width = {200} height = {150} alt = "Java course thumbnail" />
                    <div>
                        <h5> CS1237 Java </h5>
                        <p className = "wd-dashboard-course-title"> Backend Web Development
                        </p>
                        <button> Go </button>
                    </div>
                    </Link>
                </div>

                {/* Courses: 5 */}
                <div className = "wd-dashboard-course">
                    <Link href = "/courses/1238" className = "wd-dashboard-course-link">
                    <Image src = "/images/cpp.jpg" width = {200} height = {150} alt = "C++ course thumbnail" />
                    <div>
                        <h5> CS1238 C++ </h5>
                        <p className = "wd-dashboard-course-title"> Competitive Programming
                        </p>
                        <button> Go </button>
                    </div>
                    </Link>
                </div>

                {/* Courses: 6 */}
                <div className = "wd-dashboard-course">
                    <Link href = "/courses/1239" className = "wd-dashboard-course-link">
                    <Image src = "/images/htmlcss.jpg" width = {200} height = {150} alt = "HTML & CSS course thumbnail" />
                    <div>
                        <h5> CS1239 HTML & CSS </h5>
                        <p className = "wd-dashboard-course-title"> Web Design and Development
                        </p>
                        <button> Go </button>
                    </div>
                    </Link>
                </div>

                {/* Courses: 7 */}
                <div className = "wd-dashboard-course">
                    <Link href = "/courses/1240" className = "wd-dashboard-course-link">
                    <Image src = "/images/datascience.jpg" width = {200} height = {150} alt = "Data Science course thumbnail" />
                    <div>
                        <h5> CS1240 Data Science </h5>
                        <p className = "wd-dashboard-course-title"> Data Analysis and Visualization
                        </p>
                        <button> Go </button>
                    </div>
                    </Link>
                </div>

                {/* Courses: 8 */}
                <div className = "wd-dashboard-course">
                    <Link href = "/courses/1241" className = "wd-dashboard-course-link">
                    <Image src = "/images/machinelearning.jpg" width = {200} height = {150} alt = "Machine Learning course thumbnail" />
                    <div>
                        <h5> CS1241 Machine Learning </h5>
                        <p className = "wd-dashboard-course-title"> AI and Machine Learning
                        </p>
                        <button> Go </button>
                    </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}