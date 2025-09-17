import Link from "next/link";

export default async function AssignmentsPage() {
    params,
}: {
    params: Promise<{ cid: string }>;
}) {
    const { cid } = await params;
    
    const assignments = [
        { id: "123", name: "A1 - ENV + HTML" },
        { id: "124", name: "A2 - CSS + BOOTSTRAP" },
        { id: "125", name: "A3 - JavaScript + REACT" },
    ];

    return (
        <div id = "wd-assignments">
            <input placeholder
    )
}