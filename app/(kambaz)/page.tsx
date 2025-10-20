import Link from "next/link";
import { redirect } from "next/navigation";

export default function kambaz() {
    redirect ("/account/signin");
    return null;
}