"use client";

import Link from "next/link";
import { FormControl } from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default function Signin() {
  return (
    <div id = "wd-signin-screen" className = "p-3" style={{ maxWidth: 420 }}>
      <h1>Sign in</h1>
      <FormControl id = "wd-username" placeholder="username" className="mb-2"/>
      <FormControl id="wd-password" placeholder="password" type="password" className="mb-2"/>
      <Link id="wd-signin-btn" href="/account/profile" className="btn btn-primary w-100 mb-2">Sign in</Link>
      <Link id="wd-signup-link" href="/account/signup">Sign up</Link>
    </div>
  );
}
