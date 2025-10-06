'use client';

import Link from "next/link";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CardText, CardImg, CardTitle, CardBody } from "react-bootstrap";

export default function Dashboard() {
    return (
        <div id = "wd-dashboard">
            <h1 id = "wd-dashboard-title"> Dashboard </h1>
            <hr />
            <h2 id = "wd-dashboard-published"> Published Courses </h2>
            <hr />

            <div id = "wd-dashboard-courses">

                <Row xs = {1} md = {5} className = "g-4">
                    {/* Course 1 */}
                    <Col className = "wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href = "/courses/1234" className = "wd-dashboard-course-link text-decoration-none text-dark" >
                                <CardImg variant = "top" src = "/images/reactjs.jpg" width = "100%" height = {160} alt = "React JS course thumbnail" />
                                <CardBody>
                                    <CardTitle className = "wd-dashboard-course-title text-nowrap overflow-hidden" >
                                        CS1234 React JS
                                    </CardTitle>
                                    <CardText className = "wd-dashboard-course-description overflow-hidden" style = {{ height: "100px" }} >
                                        Full Stack Software Developer
                                    </CardText>
                                    <Button variant = "primary" > Go </Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>

                    {/* Course 2 */}
                    <Col className = "wd-dashboard-course" style = {{ width: "300px" }}>
                        <Card>
                            <Link href = "/courses/1235" className = "wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant = "top" src = "/images/python.jpg" width = "100%" height = {160} alt = "Python course thumbnail" />
                                <CardBody> 
                                    <CardTitle className = "wd-dashboard-course-title text-nowrap overflow-hidden" >
                                        CS1235 Python
                                    </CardTitle>
                                    <CardText className = "wd-dashboard-course-description overflow-hidden" style = {{ height: "100px" }} >
                                        Data Science and Machine Learning
                                    </CardText>
                                    <Button variant = "primary" > Go </Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>

                    {/* Course 3 */}
                    <Col className = "wd-dashboard-course" style = {{ width: "300px" }}>
                        <Card>
                            <Link href = "/courses/1236" className = "wd-dashboard-course-link text-decoration-none text-dark" >
                                <CardImg variant = "top" src = "/images/javascript.jpg" width = "100%" height = {160} alt = "JavaScript course thumbnail" />
                                <CardBody>
                                    <CardTitle className = "wd-dashboard-course-title text-nowrap overflow-hidden" >
                                        CS1236 JavaScript
                                    </CardTitle>
                                    <CardText className = "wd-dashboard-course-description overflow-hidden" style = {{ height: "100px" }} >
                                        Frontend Web Development
                                    </CardText>
                                    <Button variant = "primary" > Go </Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>

                    {/* Course 4 */} 
                    <Col className = "wd-dashboard-course" style = {{ width: "300px" }} >
                        <Card>
                            <Link href = "/courses/1237" className = "wd-dashboard-course-link text-decoration-none text-dark" >
                                <CardImg variant = "top" src = "/images/java.jpg" width = "100%" height = {160} alt = "Java course thumbnail" />
                                <CardBody>
                                    <CardTitle className = "wd-dashboard-course-title text-nowrap overflow-hidden">
                                        CS1237 Java
                                    </CardTitle>
                                    <CardText className = "wd-dashboard-course-description overflow-hidden" style = {{ height: "100px" }} >
                                        Backend Web Development
                                    </CardText>
                                    <Button variant = "primary"> Go </Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>

                    {/* Course 5 */}
                    <Col className = "wd-dashboard-course" style = {{ width: "300px" }} >
                        <Card>
                            <Link href = "/courses/1238" className = "wd-dashboard-course-link text-decoration-none text-dark" >
                                <CardImg variant = "top" src = "/images/cpp.jpg" width = "100%" height = {160} alt = "C++ course thumbnail" />
                                <CardBody>
                                    <CardTitle className = "wd-dashboard-course-title text-nowrap overflow-hidden" >
                                        CS1238 C++
                                    </CardTitle>
                                    <CardText className = "wd-dashboard-course-description overflow-hidden" style = {{ height: "100px" }} >
                                        Competitive Programming
                                    </CardText>
                                    <Button variant = "primary"> Go </Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>

                    {/* Course 6 */}
                    <Col className = "wd-dashboard-course" style = {{ width: "300px" }} >
                        <Card>
                            <Link href = "/courses/1239" className = "wd-dashboard-course-link text-decoration-none text-dark" >
                                <CardImg variant = "top" src = "/images/htmlcss.jpg" width = "100%" height = {160} alt = "HTML & CSS course thumbnail" />
                                <CardBody>
                                    <CardTitle className = "wd-dashboard-course-title text-nowrap overflow-hidden" >
                                        CS1239 HTML & CSS
                                    </CardTitle>
                                    <CardText className = "wd-dashboard-course-description overflow-hidden" style = {{ height: "100px" }} >
                                        Web Design and Development
                                    </CardText>
                                    <Button variant = "primary"> Go </Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>

                    {/* Course 7 */}  
                    <Col className = "wd-dashboard-course" style = {{ width: "300px" }} >
                        <Card>
                            <Link href = "/courses/1240" className = "wd-dashboard-course-link text-decoration-none text-dark" >
                                <CardImg variant = "top" src = "/images/datascience.jpg" width = "100%" height = {160} alt = "Data Science course thumbnail" />
                                <CardBody>
                                    <CardTitle className = "wd-dashboard-course-title text-nowrap overflow-hidden">
                                        CS1240 Data Science
                                    </CardTitle>
                                    <CardText className = "wd-dashboard-course-description overflow-hidden" style = {{ height: "100px" }} >
                                        Data Analysis and Visualization
                                    </CardText>
                                    <Button variant = "primary"> Go </Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col> 

                    {/* Course 8 */}
                    <Col className="wd-dashboard-course" style = {{ width: "300px" }} >
                        <Card>
                            <Link href = "/courses/1241" className = "wd-dashboard-course-link text-decoration-none text-dark" >
                                <CardImg variant = "top" src = "/images/machinelearning.jpg" width = "100%" height = {160} alt = "Machine Learning course thumbnail" />
                                <CardBody>
                                    <CardTitle className = "wd-dashboard-course-title text-nowrap overflow-hidden">
                                        CS1241 Machine Learning
                                    </CardTitle>
                                    <CardText className = "wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }} >
                                        AI and Machine Learning
                                    </CardText>
                                    <Button variant = "primary"> Go </Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
