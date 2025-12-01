"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
export default function AccountNavigation() {
  const { currentUser } = useSelector( ( state: any ) => state.accountReducer );
  const pathname = usePathname();
  return (
    <div id = "wd-account-navigation" className = "wd list-group fs-5 rounded-0">
      <Link
        id = "wd-account-signin-link"
        href = { `/account/signin` }
        className = { `list-group-item border border-0 ${ pathname.endsWith( 'signin' ) ? 'active text-black' : 'text-danger' }` }
      >
        Sign in
      </Link>
      <Link
        id = "wd-account-signup-link"
        href = { `/account/signup` }
        className = { `list-group-item border border-0 ${ pathname.endsWith( 'signup' ) ? 'active text-black' : 'text-danger' }` }
      >
        Sign up
      </Link>
      <Link
        id = "wd-account-profile-link"
        href = { `/account/profile` }
        className = { `list-group-item border border-0 ${ pathname.endsWith( 'profile' ) ? 'active text-black' : 'text-danger' }` }
      >
        Profile
      </Link>
      { currentUser && currentUser.role === "ADMIN" && (
        <Link
          id = "wd-account-users-link"
          href = { `/account/Users` }
          className = { `list-group-item border border-0 ${ pathname.endsWith( 'Users' ) ? 'active text-black' : 'text-danger' }` }
        >
          Users
        </Link>
      ) }
    </div>
  );
}
