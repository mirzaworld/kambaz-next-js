'use client';

import Link from "next/link";
import { FormControl } from "react-bootstrap";

export default function Signup() {
  return (
    <div id = "wd-signup-screen" className = "p-3" style = {{ maxWidth: 420 }}>
      <h1>Sign up</h1>
      <FormControl placeholder = "username" className = "mb-2" />
      <FormControl placeholder = "password" type = "password" className = "mb-2" />
      <FormControl placeholder = "verify password" type = "password" className = "mb-2" />
      <Link href = "/account/profile" className="btn btn-primary w-100 mb-2">Sign up</Link>
      <Link id = "wd-signin-link" href = "/account/signin">Sign in</Link>
    </div>
  );
}
