import Link from "next/link";

export default function AccountNavigation() {
    return (
        <div id = "wd-account-navigation">
            <Link href = "signin"> Sign In </Link> <br />
            <Link href = "signup"> Sign Up </Link> <br />
            <Link href = "profile"> Profile </Link> <br />
        </div>
    );
}