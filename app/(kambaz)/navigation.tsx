import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";

import Link from "next/link";

export default function KambazNavigation() {
    return (
        <ListGroup className = "rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2" style = {{ width: 120 }} id = "wd-kambaz-navigation" >
            {/* Northeastern University Logo */ }
            <ListGroupItem className = "bg-black border-0 text-center" as = "a"
                target = "_blank" href = "https://www.northeastern.edu/" id = "wd-neu-link" >
                    <img src = "/images/NEU.png" width = "75px" alt = "Northeastern University" />
            </ListGroupItem>
            <br />

            {/* Account */}
            <ListGroupItem className = "bg-black border-0 text-center" >
                <Link href = "/account" id = "wd-account-link" className = "text-white text-decoration-none" >
                    <FaRegCircleUser className = "fs-1 text-white" />
                    <br />
                    Account
                </Link>
            </ListGroupItem>
            <br />

            {/* Dashboard */}
            <ListGroupItem className = "border-0 bg-white text-center" >
                <Link href = "/dashboard" id = "wd-dashboard-link" className = "text-danger text-decoration-none" >
                    <AiOutlineDashboard className = "fs-1 text-danger" />
                    <br />
                    Dashboard
                </Link>
            </ListGroupItem>

            {/* Courses */}
            <ListGroupItem className = "bg-black border-0 text-center" >
                <Link href = "/courses" id = "wd-course-link" className = "text-white text-decoration-none" >
                    <LiaBookSolid className = "fs-1 text-white" />
                    <br />
                    Courses
                </Link>
            </ListGroupItem>

            {/* Calendar */}
            <ListGroupItem className = "bg-black border-0 text-center" >
                <Link href = "/calendar" id = "wd-calendar-link" className = "text-white text-decoration-none" >
                    <IoCalendarOutline className = "fs-1 text-white" />
                    <br />
                    Calendar
                </Link>
            </ListGroupItem>
            <br />

            {/* Inbox */}
            <ListGroupItem className = "bg-black border-0 text-center" >
                <Link href = "/inbox" id = "wd-inbox-link" className = "text-white text-decoration-none" >
                    <FaInbox className = "fs-1 text-danger" />
                    <br />
                    Inbox
                </Link>
            </ListGroupItem>
            <br />

            {/* Labs */}
            <ListGroupItem className = "bg-black border-0 text-center" >
                <Link href = "/labs" id = "wd-labs-link" className = "text-white text-decoration-none" >
                    <LiaCogSolid className = "fs-1 text-danger" />
                    <br />
                    Labs
                </Link>
            </ListGroupItem>

            {/* 
            <div id = "wd-kambaz-navigation">
            <a href = "https://www.northeastern.edu/" id = "wd-neu-link" target = "_blank" > Northeastern </a> <br />
            <Link href = "/account" id = "wd-account-link"> Account </Link> <br />
            <Link href = "/dashboard" id = "wd-dashboard-link"> Dashboard </Link> <br />
            <Link href = "/dashboard" id = "wd-course-link"> Courses </Link> <br />
            <Link href = "/calendar" id = "wd-calendar-link"> Calendar </Link> <br />
            <Link href = "/inbox" id = "wd-inbox-link"> Inbox </Link> <br />
            <Link href = "/labs" id = "wd-labs-link"> Labs </Link> <br />
            </div>
            */}
        </ListGroup>
    );
}