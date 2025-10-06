import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";

export default function TOC() {
    return (
        <Nav variant = "pills" >
            <NavItem>
                <NavLink href = "/labs" as = {Link} > Labs </NavLink>
            </NavItem>
            <NavItem>
                <NavLink href = "/labs/lab1" as = {Link} > Lab 1 </NavLink>
            </NavItem>
            <NavItem>
                <NavLink href = "/labs/lab2" as = {Link} > Lab 2 </NavLink>
            </NavItem>
            <NavItem>
                <NavLink href = "/labs/lab3" as = {Link} > Lab 3 </NavLink>
            </NavItem>
            <NavItem>
                <NavLink href = "/" as = {Link} > Kambaz </NavLink>
            </NavItem>
            <NavItem>
                <NavLink href = "https://github.com/mirzaworld/kambaz-next-js" id = "wd-github" as = {Link} > GitHub </NavLink>
            </NavItem>
            <NavItem>
                <NavLink href = "https://kambaz-next-js-sooty.vercel.app" as = {Link} > Vercel </NavLink>
            </NavItem>
        </Nav>
    );
}