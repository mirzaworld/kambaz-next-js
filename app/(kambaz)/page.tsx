import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function kambaz() {
  redirect("/account/signin");
  return null;
}
