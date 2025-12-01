"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import { FaPlus, FaCheckCircle } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BsSearch, BsThreeDotsVertical, BsGripVertical } from "react-icons/bs";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { setAssignments, addAssignment, deleteAssignment } from "./reducer";
import { useEffect } from "react";
import * as client from "./client";
import type { Assignment } from "../../../types";

export default function Assignments() {
  const { cid } = useParams<{ cid : string }>();

  const all = useSelector( ( state: RootState ) => ( state.assignmentsReducer )?.assignments || [] );
  const dispatch = useDispatch();

  const items = ( Array.isArray( all ) ? all : [] ).filter(
    ( a : Assignment ) => String( a.course || "" ).toLowerCase() === String( cid ).toLowerCase()
  );

  const add = ( title: string ) => {
    const t = String( title || "" ).trim();
    if ( !t ) return;
    // persist to server then update store with returned assignment
    client.createAssignmentForCourse( String( cid ), { title: t } )
      .then( ( created ) => dispatch( addAssignment( created ) ) );
  };

  const addPrompt = () => {
    const title = window.prompt( "New assignment title" );
    if ( title ) add( title );
  };

  return (
    <div id = "wd-assignments" className = "pt-2">
      <FetchAssignmentsOnMount cid={String(cid)} />
      <Row className = "align-items-center">
        <Col xs = { 12 } md = { 6 } className = "mb-2 mb-md-0">
          <InputGroup>
            <InputGroup.Text> <BsSearch /> </InputGroup.Text>
            <Form.Control id = "wd-search-assignment" placeholder = "Search" />
          </InputGroup>
        </Col>
        <Col xs = { 12 } md = { 6 } className = "text-md-end">
          <Button id = "wd-add-assignment-group" variant = "secondary" className = "me-2">
            <FaPlus className = "me-2" /> Group
          </Button>
          <Button id = "wd-add-assignment" variant = "danger" onClick = { addPrompt } className = "me-2">
            <FaPlus className = "me-2" /> Assignment
          </Button>
          <Button size = "sm" variant = "light" className = "border"> <BsThreeDotsVertical /> </Button>
        </Col>
      </Row>

      <Card className = "mt-4 shadow-sm border-gray">
        <Card.Header className = "d-flex justify-content-between align-items-center">
          <div className = "d-flex align-items-center">
            <BsGripVertical className = "me-2" />
            <IoMdArrowDropdown className = "me-2" />
            <span className = "fw-semibold"> ASSIGNMENTS </span>
          </div>
          <div className = "d-flex align-items-center gap-2">
            <Form.Select size = "sm" className = "w-auto">
              <option> 40% of Total </option>
            </Form.Select>
            <Button size = "sm" variant = "light" className = "border"> <FaPlus /> </Button>
            <Button size = "sm" variant = "light" className = "border"> <BsThreeDotsVertical /> </Button>
          </div>
        </Card.Header>

        <ListGroup variant = "flush" id = "wd-assignment-list">
          { items.map( ( a : Assignment ) => (
            <ListGroup.Item
              key = { a._id }
              className = "wd-assignment-list-item border-0 border-start border-success ps-3"
            >
              <div className = "d-flex align-items-start">
                <BsGripVertical className = "me-2 text-secondary fs-4" />
                <HiOutlinePencilAlt className = "me-3 text-secondary text-success" />
                <div className = "flex-fill">
                  <Link
                    href = { `/courses/${ cid }/assignments/${ a._id }` }
                    className = "wd-assignment-link text-decoration-none text-dark"
                    id = { `wd-assignment-${ a._id }-link` }
                  >
                    <div className = "fw-bold"> { a.title } </div>
                  </Link>
                  <div className = "text-muted small">
                    <span className = "text-danger"> Multiple Modules </span> &nbsp;|&nbsp;
                    Not available yet &nbsp;|&nbsp;
                    <span className = "fw-semibold"> 100 pts </span>
                  </div>
                </div>
                  <FaCheckCircle className = "ms-2 text-success" />
                  <button
                    className = "btn btn-sm btn-outline-danger ms-2"
                    onClick = { () => {
                      client.deleteAssignment( a._id )
                        .then( () => dispatch( deleteAssignment( a._id ) ) );
                    } }
                  >Delete</button>
              </div>
            </ListGroup.Item>
          ))}

          { items.length === 0 && (
            <ListGroup.Item className = "text-secondary">
              { " " } No assignments for this course yet. { " " }
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    </div>
  );
}

    function FetchAssignmentsOnMount( { cid } : { cid: string } ) {
      const dispatch = useDispatch();
      useEffect( () => {
        const fetch = async () => {
          try {
            const assignments = await client.fetchAssignmentsForCourse( String( cid ) );
            dispatch( setAssignments( assignments ) );
          } catch ( _e ) {}
        };
        fetch();
      }, [ cid, dispatch ] );
      return null;
    }

