import { redirect } from "next/navigation";

export default async function Courses({
  params,
}: {
  params: { cid: string };   // ⬅️ not a Promise
}) {
  const { cid } = params;    // ⬅️ no await
  redirect(`/courses/${cid}/home`);
}
