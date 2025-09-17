import { redirect } from "next/navigation";

export default async function CoursePage({ params,}: { params: Promise<{ cid: string }>,}) {
    const { cid } = await params;
    redirect(`/courses/${cid}/home`);
}