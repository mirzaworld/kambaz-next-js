"use client";

import Link from "next/link";
import { FormControl, Button } from "react-bootstrap";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import * as client from "../client";
import { setCurrentUser } from "../reducer";
import type { User } from "../../types";

type Credentials = { username?: string; password?: string };

export default function Signin() {
  const [ credentials, setCredentials ] = useState<Credentials>({});
  const dispatch = useDispatch();
  const router = useRouter();

  const signin = async () => {
    try {
      const user = await client.signin(credentials);
      if (!user) return;
      dispatch(setCurrentUser(user));
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div id = "wd-signin-screen" className = "p-3" style = {{ maxWidth: 420 }}>
      <h1>Sign in</h1>
      <FormControl id = "wd-username" placeholder = "username" className = "mb-2"
        defaultValue = {credentials.username}
        onChange = {( e: React.ChangeEvent<HTMLInputElement> ) => setCredentials( { ...credentials, username: e.target.value } ) }
      />
      <FormControl id = "wd-password" placeholder = "password" type = "password" className = "mb-2"
        defaultValue = {credentials.password}
        onChange = {( e: React.ChangeEvent<HTMLInputElement> ) => setCredentials( { ...credentials, password: e.target.value } ) }
      />
      <Button id = "wd-signin-btn" className = "w-100 mb-2" onClick = { signin } > Sign in </Button>
      <Link id = "wd-signup-link" href = "/account/signup"> Sign up </Link>
    </div>
  );
}
