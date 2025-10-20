"use client";

import Link from "next/link";
import * as db from "../database";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CardText, CardImg, CardTitle, CardBody } from "react-bootstrap";

export default function Dashboard() {
    const courses = db.courses as Array<{
        _id: string;
        name: string;
        description: string;
    }>;

    const images = [
        "/images/reactjs.jpg",
        "/images/python.jpg",
        "/images/javascript.jpg",
        "/images/java.jpg",
        "/images/cpp.jpg",
        "/images/htmlcss.jpg",
        "/images/datascience.jpg",
        "/images/machinelearning.jpg",
    ];

    return (
        <div id = "wd-dashboard">
        <h1 id = "wd-dashboard-title"> Dashboard </h1>
        <hr />
        <h2 id = "wd-dashboard-published"> Published Courses ( { courses.length } ) </h2>
        <hr />

        <div id = "wd-dashboard-courses">
            <Row xs = { 1 } md = { 5 } className = "g-4">
                { courses.map( ( course, idx ) => {
                    const img = images[ idx % images.length ];
                    return (
                        <Col
                            key = { course._id }
                            className = "wd-dashboard-course"
                            style = {{ width: "300px" }}
                        >
                            <Card>
                                <Link
                                    href = { `/courses/${ course._id }/home` }
                                    className = "wd-dashboard-course-link text-decoration-none text-dark"
                                >
                                    <CardImg
                                        src = { img }
                                        variant = "top"
                                        width = "100%"
                                        height = { 160 }
                                        alt = { `${ course.name } thumbnail` }
                                    />
                                    <CardBody className = "card-body">
                                        <CardTitle className = "wd-dashboard-course-title text-nowrap overflow-hidden">
                                            { course.name }
                                        </CardTitle>
                                        <CardText
                                            className = "wd-dashboard-course-description overflow-hidden"
                                            style = {{ height: "100px" }}
                                        >
                                            { course.description }
                                        </CardText>
                                        <Button variant = "primary"> Go </Button>
                                    </CardBody>
                                </Link>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </div>
    </div>
  );
}
