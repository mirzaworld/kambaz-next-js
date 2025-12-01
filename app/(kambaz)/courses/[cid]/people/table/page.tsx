"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PeopleTable from "../Table";
import * as coursesClient from "../../../client";

export default function CoursePeoplePage() {
  const { cid } = useParams<{ cid : string }>();
  const [ users, setUsers ] = useState<any[]>( [] );

  const fetchUsers = async () => {
    if ( !cid ) return;
    const list = await coursesClient.findUsersForCourse( String( cid ) );
    setUsers( list );
  };

  useEffect( () => {
    fetchUsers();
  }, [ cid ] );

  return (
    <div id = "wd-people-table" className = "table-responsive">
      <PeopleTable users = { users } fetchUsers = { fetchUsers } />
    </div>
  );
}
