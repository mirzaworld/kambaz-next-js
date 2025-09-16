import Link from "next/link";
import { redirect } from "next/navigation";

export default function kambaz() {
    redirect ("/account/signin");
    return (
        <div id = "wd-kambaz">

            <h1> Kambaz </h1>

        <Link href = "/labs" id = "wd-labs-link" >
        Back </Link>
        
        </div>
        
    );
}