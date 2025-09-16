import Link from "next/link";

export default function signin() {
    return (
        <div id = "wd-signin-screen" >
            <h3> Sign in </h3>
            <input placeholder = "username" className = "wd-username" /> <br />
            <input type = "password" placeholder = "password" className = "wd-password" /> <br />
            <Link href = "/dashboard" id = "wd-signin-btn" > Sign in </Link> <br />
            <Link href = "signup" id = "wd-signup-link" > Sign up </Link>
        </div>
    );
}