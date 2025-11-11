"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { FaUserCircle } from "react-icons/fa";
import { users } from "../../../../database";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { unenrollUser, enrollUser } from "../../../../enrollments/reducer";
import type { Enrollment, User } from "../../../../types";

export default function PeopleTable() {
  const { cid } = useParams<{ cid : string }>();
  const courseId = String( cid || "" ).toLowerCase();

  const enrolls = useSelector(( state: RootState ) => ( state.enrollmentsReducer )?.enrollments || [] );
  const dispatch = useDispatch();
  const [ selectedUser, setSelectedUser ] = useState<string>( "" );

  const notEnrolled = ( Array.isArray( users ) ? users : [] ).filter( ( usr : User ) =>
    !( ( Array.isArray( enrolls ) ? enrolls : [] ) ).some( ( en : Enrollment ) => String( en.user || "" ) === String( usr._id || "" ) && String( en.course || "" ).toLowerCase() === courseId )
  );

  const rows = ( Array.isArray( users ) ? users : [] ).filter( ( usr : User ) =>
    ( Array.isArray( enrolls ) ? enrolls : [] ).some(
      ( en : Enrollment ) =>
        String( en.user || "" ) === String( usr._id || "" ) &&
        String( en.course || "" ).toLowerCase() === courseId
    )
  );

  return (
    <div id = "wd-people-table" className = "table-responsive">
      <div className = "d-flex mb-3 align-items-center gap-2">
        <select className = "form-select w-auto" value = { selectedUser } onChange = {(e) => setSelectedUser(e.target.value)}>
          <option value = "">Select user to enroll</option>
          { notEnrolled.map( (u: User) => (
            <option key = { u._id } value = { u._id }>{ u.firstName } { u.lastName } ({ u.loginId })</option>
          ) ) }
        </select>
        <Button variant = "primary" onClick = { () => {
          if ( selectedUser ) {
            dispatch( enrollUser( { user: selectedUser, course: cid } ) );
            setSelectedUser( "" );
          }
        } }>Enroll</Button>
      </div>
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
          { rows.map( ( user : User ) => (
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
              <td className = "text-end">
                {/* find enrollment id for this user-course */}
                { ( ( enrolls || [] ) as Enrollment[] ).some( ( en : Enrollment ) => String( en.user ) === String( user._id ) && String( en.course ).toLowerCase() === courseId ) && (
                  <Button size = "sm" variant = "outline-danger" onClick = { () => {
                    const enrollment = ( enrolls as Enrollment[] ).find( ( en : Enrollment ) => String( en.user ) === String( user._id ) && String( en.course ).toLowerCase() === courseId );
                    if ( enrollment ) dispatch( unenrollUser( enrollment._id ) );
                  } }>
                    Unenroll
                  </Button>
                ) }
              </td>
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
