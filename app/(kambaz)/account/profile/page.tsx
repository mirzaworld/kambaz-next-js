"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FormSelect, FormControl, Button } from "react-bootstrap";
import { setCurrentUser } from "../reducer";
import type { User } from "../../types";

type ProfileForm = Partial<User> & { username?: string; password?: string; email?: string; dob?: string };

export default function Profile() {
  const currentUser = useSelector(( state: { accountReducer: { currentUser: User | null } }) => state.accountReducer?.currentUser);
  const [ form, setForm ] = useState<ProfileForm>( currentUser || {} );
  const dispatch = useDispatch();
  const router = useRouter();

  const signout = () => {
    dispatch( setCurrentUser( null ) );
    router.push( "/account/signin" );
  };

  const [ saved, setSaved ] = useState<boolean>( false );

  const save = () => {
    // Basic validation: require username
    if (!form.username || String(form.username).trim() === "") return;
    // Update store
    dispatch( setCurrentUser( form as User ) );
    setSaved( true );
    setTimeout( () => setSaved( false ), 1600 );
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => setForm( { ...form, [ e.target.id.replace("wd-", "") ]: e.target.value } );
  const onSelect = (e: React.ChangeEvent<HTMLSelectElement>) => setForm( { ...form, role: e.target.value } );

  return (
    <div id = "wd-profile-screen" className = "p-3" style = {{ maxWidth: 520 }}>
      <h1>Profile</h1>
      <FormControl id = "wd-username" placeholder = "username" className = "mb-2"
        value = {form.username || ""}
        onChange = { onInput }
      />
      <FormControl id = "wd-password" placeholder = "password" type = "password" className = "mb-2"
        value = {form.password || ""}
        onChange = { onInput }
      />
      <FormControl id = "wd-firstName" placeholder = "First Name" className = "mb-2"
        value = {form.firstName || ""}
        onChange = { onInput }
      />
      <FormControl id = "wd-lastName" placeholder = "Last Name" className = "mb-2"
        value = {form.lastName || ""}
        onChange = { onInput }
      />
      <FormControl id = "wd-dob" type = "date" className = "mb-2"
        value = {form.dob || ""}
        onChange = { onInput }
      />
      <FormControl id = "wd-email" type = "email" className = "mb-2"
        value = {form.email || ""}
        onChange = { onInput }
      />
      <FormSelect id = "wd-role" value = {form.role || "USER"} className = "mb-3"
        onChange = { onSelect }
      >
        <option value = "USER">User</option>
        <option value = "ADMIN">Admin</option>
        <option value = "FACULTY">Faculty</option>
        <option value = "STUDENT">Student</option>
      </FormSelect>
      <div className = "d-grid gap-2">
        <Button id = "wd-save-btn" variant = "primary" className = "w-100" onClick = { save } >Save</Button>
        <Button id = "wd-signout-btn" variant = "danger" className = "w-100" onClick = { signout } >Sign out</Button>
      </div>
      { saved && <div className = "mt-2 alert alert-success" role = "status">Profile saved</div> }
    </div>
  );
}
