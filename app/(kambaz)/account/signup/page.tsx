"use client";

import Link from "next/link";
import { FormControl } from "react-bootstrap";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import * as client from "../client";
import { setCurrentUser } from "../reducer";

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const dispatch = useDispatch();
  const router = useRouter();

  const signup = async () => {
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      router.push("/account/profile");
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div id="wd-signup-screen" className="p-3" style={{ maxWidth: 420 }}>
      <h1>Sign up</h1>
      <FormControl placeholder="username" className="mb-2" value={user.username || ""}
        onChange={(e) => setUser({ ...user, username: e.target.value })} />
      <FormControl placeholder="password" type="password" className="mb-2" value={user.password || ""}
        onChange={(e) => setUser({ ...user, password: e.target.value })} />
      <FormControl placeholder="verify password" type="password" className="mb-2" />
      <button onClick={signup} className="btn btn-primary w-100 mb-2">Sign up</button>
      <Link id="wd-signin-link" href="/account/signin">Sign in</Link>
    </div>
  );
}
