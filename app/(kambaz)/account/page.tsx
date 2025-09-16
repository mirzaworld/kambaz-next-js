import { redirect } from "next/dist/client/components/navigation";

export default function accountpage() {
    redirect("/account/signin");
}