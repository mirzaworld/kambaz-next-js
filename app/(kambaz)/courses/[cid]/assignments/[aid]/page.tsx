"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as client from "../client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { updateAssignment as updateAssignmentAction } from "../reducer";
import type { Assignment } from "../../../types";

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();
  const router = useRouter();
  const dispatch = useDispatch();
  const existing = useSelector((state: RootState) => (state.assignmentsReducer.assignments as Assignment[]) || []).find(a => a._id === aid);
  const [assignment, setAssignment] = useState<Assignment>(existing || { _id: String(aid), course: String(cid), title: "", description: "", points: 100 });
  const [loading, setLoading] = useState(!existing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!existing && aid) {
      client.fetchAssignmentById(String(aid)).then((data) => {
        setAssignment(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [existing, aid]);

  const save = async () => {
    setSaving(true);
    try {
      await client.updateAssignment(String(aid), assignment);
      dispatch(updateAssignmentAction(assignment));
      router.push(`/courses/${cid}/assignments`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-3">Loading...</div>;

  return (
    <div className="p-3">
      <h4 className="mb-3">Edit Assignment</h4>
      <Form onSubmit={(e) => { e.preventDefault(); save(); }}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={assignment.title || ""}
            onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
            placeholder="Assignment title"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={assignment.description || ""}
            onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
            placeholder="Describe the assignment"
          />
        </Form.Group>
        <Row>
          <Col md={4} className="mb-3">
            <Form.Label>Points</Form.Label>
            <Form.Control
              type="number"
              value={assignment.points || 0}
              onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) })}
            />
          </Col>
          <Col md={4} className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={(assignment.dueDate || "").substring(0, 10)}
              onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
            />
          </Col>
          <Col md={4} className="mb-3">
            <Form.Label>Available From</Form.Label>
            <Form.Control
              type="date"
              value={(assignment.availableDate || "").substring(0, 10)}
              onChange={(e) => setAssignment({ ...assignment, availableDate: e.target.value })}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4} className="mb-3">
            <Form.Label>Available Until</Form.Label>
            <Form.Control
              type="date"
              value={(assignment.availableUntilDate || "").substring(0, 10)}
              onChange={(e) => setAssignment({ ...assignment, availableUntilDate: e.target.value })}
            />
          </Col>
        </Row>
        <div className="d-flex gap-2 mt-2">
          <Button type="submit" variant="danger" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          <Button variant="secondary" onClick={() => router.back()} disabled={saving}>Cancel</Button>
        </div>
      </Form>
    </div>
  );
}
