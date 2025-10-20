"use client";

import React from "react";
import { useParams } from "next/navigation";
import Table from "react-bootstrap/Table";
import { FaUserCircle } from "react-icons/fa";
import { users, enrollments } from "../../../../database";

export default function PeopleTable() {
  const { cid } = useParams<{ cid : string }>();
  const courseId = String( cid || "" ).toLowerCase();

  const rows = ( Array.isArray( users ) ? users : [] ).filter( ( usr : any ) =>
    ( Array.isArray( enrollments ) ? enrollments : [] ).some(
      ( en : any ) =>
        String( en.user || "" ) === String( usr._id || "" ) &&
        String( en.course || "" ).toLowerCase() === courseId
    )
  );

  return (
    <div id = "wd-people-table" className = "table-responsive">
      <Table striped className = "align-middle" style = {{ minWidth : 900 }}>
        <thead>
          <tr>
            <th> Name </th>
            <th> Login ID </th>
            <th> Section </th>
            <th> Role </th>
            <th> Last Activity </th>
            <th> Total Activity </th>
          </tr>
        </thead>
        <tbody>
          { rows.map( ( user : any ) => (
            <tr key = { user._id }>
              <td className = "wd-full-name text-nowrap">
                <FaUserCircle className = "me-2 fs-3 text-secondary" />
                <span className = "wd-first-name"> { user.firstName } </span>
                <span className = "wd-last-name"> { " " } { user.lastName } </span>
              </td>
              <td className = "wd-login-id"> { user.loginId } </td>
              <td className = "wd-section"> { user.section } </td>
              <td className = "wd-role"> { user.role } </td>
              <td className = "wd-last-activity"> { user.lastActivity } </td>
              <td className = "wd-total-activity"> { user.totalActivity } </td>
            </tr>
          ) ) }
          { rows.length === 0 && (
            <tr>
              <td colSpan = { 6 } className = "text-secondary"> No users enrolled for this course. </td>
            </tr>
          ) }
        </tbody>
      </Table>
    </div>
  );
}
