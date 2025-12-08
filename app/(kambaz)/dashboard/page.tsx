"use client";

import React, { useState } from "react";
import Link from "next/link";
import * as coursesClient from "../courses/client";
import { setCourses } from "../courses/reducer";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import { CardText, CardImg, CardTitle, CardBody } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

export default function Dashboard() {

    const { courses } = useSelector(
        (state: RootState) => state.coursesReducer
    );
    const [ allCourses, setAllCourses ] = useState<any[]>( [] );

    const { currentUser } = useSelector(
        (state: RootState) => state.accountReducer
    );

    const dispatch = useDispatch();

    

    const [course, setCourse] = useState<any>({
        _id: "0",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        image: "/images/reactjs.jpg",
        description: "New Description",
    });

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

    React.useEffect(() => {
        const fetch = async () => {
            try {
                const my = await coursesClient.findMyCourses();
                if ( my && Array.isArray( my ) ) { dispatch( setCourses( my ) ); }
                const all = await coursesClient.fetchAllCourses();
                if ( all && Array.isArray( all ) ) { setAllCourses( all ); }
            } catch ( e ) {}
        };
        fetch();
    }, [ currentUser ] );

    const visibleCourses = courses;
    const notEnrolled = allCourses.filter( (c:any) => !visibleCourses.some( (m:any) => m._id === c._id ) );

    return (
        <div id = "wd-dashboard" >

            <h1 id = "wd-dashboard-title" > Dashboard </h1>
            <hr />

            <h5>
                New Course
                <Button
                    className = "btn btn-primary float-end"
                    id = "wd-add-new-course-click"
                    onClick = {async () => {
                        try {
                            const created = await coursesClient.createCourse(course);
                            dispatch(setCourses([ ...courses, created ]));
                        } catch (err) {
                            // ignore — keep local behavior if server not available
                        }
                    }}>
                        Add
                </Button>
                <Button
                    className = "btn btn-warning float-end me-2"
                    id = "wd-update-course-click"
                    onClick = {async () => {
                        try {
                            const updated = await coursesClient.updateCourse(course._id, course);
                            dispatch(setCourses(courses.map((c: any) => c._id === updated._id ? updated : c)));
                        } catch (err) {
                            dispatch(setCourses(courses.map((c: any) => c._id === course._id ? course : c)));
                        }
                    }}>
                        Update
                </Button>
            </h5>

            <br />

            <FormControl
                className = "mb-2"
                value = {course.name}
                onChange = {(e) =>
                    setCourse({ ...course, name: e.target.value })
                }
            />
            
            <FormControl
                className = "mb-2"
                value = {course.description}
                onChange = {(e) =>
                    setCourse({ ...course, description: e.target.value })
                }
            />

            <hr />

            <h2 id = "wd-dashboard-published" >
                My Courses ( { visibleCourses.length } )
            </h2>
            <hr />

            <div id = "wd-dashboard-courses" >
                <Row xs = { 1 } md = { 5 } className = "g-4" >
                    { visibleCourses.map( (course: any, idx: number) => {
                        const img = images[ idx % images.length ];
                        return (
                            <Col
                            key = { course._id }
                            className = "wd-dashboard-course"
                            style = {{ width: "300px" }}>
                                <Card>
                                    <Link
                                    href = { `/courses/${ course._id }/home` }
                                    className = "wd-dashboard-course-link text-decoration-none text-dark">
                                        <CardImg
                                        src = { course.image || img }
                                        variant = "top"
                                        width = "100%"
                                        height = { 160 }
                                        alt = { `${ course.name } thumbnail` }
                                        />
                                        <CardBody className = "card-body" >
                                            <CardTitle className = "wd-dashboard-course-title text-nowrap overflow-hidden" >
                                                { course.name }
                                            </CardTitle>
                                            <CardText
                                            className = "wd-dashboard-course-description"
                                            style = {{ 
                                                height: "100px",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 4,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}>
                                                { course.description }
                                            </CardText>
                                                                                        <Button variant = "primary" >
                                                                                                Go
                                                                                        </Button>
                                                                                        { currentUser && (
                                                                                            <Button
                                                                                                className = "btn btn-outline-secondary ms-2"
                                                                                                onClick = { async (e) => { e.preventDefault(); await coursesClient.unenrollFromCourse( currentUser._id, course._id ); const my = await coursesClient.findMyCourses(); dispatch( setCourses( my ) ); } }>
                                                                                                Unenroll
                                                                                            </Button>
                                                                                        ) }
                                            <Button
                                            id = "wd-edit-course-click"
                                            className = "btn btn-warning me-2 float-end"
                                            onClick = {(event) => {
                                                event.preventDefault();
                                                setCourse(course);
                                            }}>
                                                Edit
                                            </Button>
                                            <Button
                                            id = "wd-delete-course-click"
                                            className = "btn btn-danger float-end"
                                            onClick = {async (event) => {
                                                event.preventDefault();
                                                try {
                                                    await coursesClient.deleteCourse(course._id);
                                                    dispatch(setCourses(courses.filter((c: any) => c._id !== course._id)));
                                                } catch (err) {
                                                    dispatch(setCourses(courses.filter((c: any) => c._id !== course._id)));
                                                }
                                            }}>
                                                Delete
                                            </Button>
                                        </CardBody>
                                    </Link>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
                        </div>
                        <hr />
                        <h2> All Courses ( { notEnrolled.length } ) </h2>
                        <hr />
                        <div>
                            <Row xs = {1} md = {5} className = "g-4">
                                { notEnrolled.map( (course:any, idx:number) => {
                                    const img = images[ idx % images.length ];
                                    return (
                                        <Col key = {course._id} style = {{ width:"300px" }}>
                                            <Card>
                                                <Link href = {`/courses/${course._id}/home`} className = "text-decoration-none text-dark">
                                                    <CardImg src = { course.image || img } variant = "top" width = "100%" height = {160} />
                                                    <CardBody>
                                                        <CardTitle className = "text-nowrap overflow-hidden"> { course.name } </CardTitle>
                                                        <CardText 
                                                            className = "overflow-hidden text-truncate" 
                                                            style = {{ 
                                                                height: "100px",
                                                                display: "-webkit-box",
                                                                WebkitLineClamp: 4,
                                                                WebkitBoxOrient: "vertical",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis"
                                                            }}
                                                        > 
                                                            { course.description } 
                                                        </CardText>
                                                        { currentUser && (
                                                            <Button
                                                                className = "btn btn-outline-primary"
                                                                onClick = { async (e) => { e.preventDefault(); await coursesClient.enrollIntoCourse( currentUser._id, course._id ); const my = await coursesClient.findMyCourses(); dispatch( setCourses( my ) ); } }>
                                                                Enroll
                                                            </Button>
                                                        ) }
                                                    </CardBody>
                                                </Link>
                                            </Card>
                                        </Col>
                                    );
                                } ) }
                            </Row>
                        </div>
        </div>
    );
}
