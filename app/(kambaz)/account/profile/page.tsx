import Link from "next/link";

export default function profile() {
    return (
        <div id = "wd-profile-screen">
            <h3> Profile </h3>
            <input defaultValue = "alice" placeholder = "username" className = "wd-username" /> <br />
            <input defaultValue = "123" placeholder = "password" type = "password" className = "wd-password" /> <br />

            <input defaultValue = "Alice" placeholder = "First Name" id = "wd-firstname" /> <br />
            <input defaultValue = "Wonderland" placeholder = "Last Name" id = "wd-lastname" /> <br />
            <input defaultValue = "2000-01-01" type = "date" id = "wd-dob" /> <br />
            <input defaultValue = "alice@wonderland.com" type = "email" id = "wd-email" /> <br />
            <select defaultValue = "FACULTY" id = "wd-role">
                <option value = "FACULTY"> Faculty </option>
                <option value = "STUDENT"> Student </option>
                <option value = "Admin"> Admin </option>
                <option value = "User"> User </option>
            </select> <br />

            <Link href = "signin" > Sign out </Link>
        </div>
    );
}