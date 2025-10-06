'use client';

import Link from "next/link";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { FaPlus, FaCheckCircle, FaRegClone } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BsSearch, BsThreeDotsVertical, BsGripVertical } from "react-icons/bs";

export default function Assignments() {
  return (
    <div id = "wd-assignments" className = "pt-2">
      <Row className = "align-items-center">
        <Col xs = {12} md = {6} className = "mb-2 mb-md-0">
          <InputGroup>
            <InputGroup.Text><BsSearch /></InputGroup.Text>
            <Form.Control id = "wd-search-assignment" placeholder = "Search" />
          </InputGroup>
        </Col>
        <Col xs = {12} md = {6} className = "text-md-end">
          <Button id = "wd-add-assignment-group" variant = "secondary" className = "me-2">
            <FaPlus className="me-2" /> Group
          </Button>
          <Button id = "wd-add-assignment" variant = "danger">
            <FaPlus className = "me-2" /> Assignment
          </Button>
        </Col>
      </Row>

      <Card className = "mt-4 shadow-sm border-gray">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <BsGripVertical className="me-2" />
            <IoMdArrowDropdown className="me-2" />
            <span className="fw-semibold" >ASSIGNMENTS</span>
          </div>
          <div className = "d-flex align-items-center gap-2">
            <Form.Select size = "sm" className = "w-auto">
              <option>40% of Total</option>
            </Form.Select>
            <Button size = "sm" variant="light" className = "border"><FaPlus /></Button>
            <Button size = "sm" variant = "light" className = "border"><BsThreeDotsVertical /></Button>
          </div>
        </Card.Header>

        <ListGroup variant="flush" id="wd-assignment-list">
          {/* A1 */}
          <ListGroup.Item className = "wd-assignment-list-item border-0 border-start border-success ps-3">
            <div className = "d-flex align-items-start">
              <BsGripVertical className = "me-2 text-secondary fs-4"/>
              <HiOutlinePencilAlt className = "me-3 text-secondary text-success" />

              <div className = "flex-fill">
                <Link href = "/courses/1234/assignments/123" className = "wd-assignment-link text-decoration-none text-dark">
                  <div className = "fw-bold">A1</div>
                </Link>
                <div className = "text-muted small">
                  <span className = "text-danger "> Multiple Modules </span> &nbsp;|&nbsp;
                   Not available until May 6 at 12:00am &nbsp;|&nbsp;
                  <span className = "fw-semibold">Due May 13 at 11:59pm</span> &nbsp;|&nbsp; 100 pts
                </div>
              </div>

              {/* right icons: green check + menu */}
              <FaCheckCircle className = "ms-2 text-success" />
              <BsThreeDotsVertical className = "ms-2 text-secondary" />
            </div>
          </ListGroup.Item>

          {/* A2 */}
          <ListGroup.Item className = "wd-assignment-list-item border-0 border-start border-success ps-3">
            <div className = "d-flex align-items-start">
              <BsGripVertical className = "me-2 text-secondary fs-4" />
              <HiOutlinePencilAlt className = "me-3 text-secondary text-success" />
              <div className = "flex-fill">
                <Link href = "/courses/1234/assignments/124" className = "wd-assignment-link text-decoration-none text-dark">
                  <div className = "fw-bold">A2</div>
                </Link>
                <div className = "text-muted small">
                  <span className = "text-danger "> Multiple Modules </span> &nbsp;|&nbsp;
                   Not available until May 13 at 12:00am &nbsp;|&nbsp;
                  <span className="fw-semibold">Due May 20 at 11:59pm</span> &nbsp;|&nbsp; 100 pts
                </div>
              </div>
              <FaCheckCircle className = "ms-2 text-success" />
              <BsThreeDotsVertical className = "ms-2 text-secondary" />
            </div>
          </ListGroup.Item>

          {/* A3 */}
          <ListGroup.Item className = "wd-assignment-list-item border-0 border-start border-success ps-3">
            <div className = "d-flex align-items-start">
              <BsGripVertical className = "me-2 text-secondary fs-4" />
              <HiOutlinePencilAlt className = "me-3 text-secondary text-success" />
              <div className = "flex-fill">
                <Link href = "/courses/1234/assignments/125" className = "wd-assignment-link text-decoration-none text-dark">
                  <div className = "fw-bold">A3</div>
                </Link>
                <div className = "text-muted small">
                  <span className = "text-danger "> Multiple Modules </span> &nbsp;|&nbsp;
                   Not available until May 20 at 12:00am &nbsp;|&nbsp;
                  <span className = "fw-semibold">Due May 27 at 11:59pm</span> &nbsp;|&nbsp; 100 pts
                </div>
              </div>
              <FaCheckCircle className = "ms-2 text-success" />
              <BsThreeDotsVertical className = "ms-2 text-secondary" />
            </div>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
}
