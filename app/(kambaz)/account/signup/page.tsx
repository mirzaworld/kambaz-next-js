import Link from "next/link";

export default function signup() {
    return (
        <div id = "wd-signup-screen">
            <h1>Sign Up</h1>
            <input placeholder = "username" className = "wd-username" /> <br />
            <input placeholder = "password" type = "password" className = "wd-password" /> <br />
            <input placeholder = "verify password" type = "password" className = "wd-password-verify" /> <br />

            <Link href = "profile" > Sign up </Link> <br />
            <Link href = "signin" > Sign in </Link>    
            
         </div>
    );
}