import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Page() {
    const session = await auth();
    const userId = session?.user?.id;

    const [myPendingCount, allPendingCount, completedCount] = await Promise.all([
        userId
            ? prisma.task.count({
                where: {
                    assigneeId: userId,
                    status: { in: ["PENDING", "IN_PROGRESS"] },
                },
            })
            : 0,
        prisma.task.count({
            where: { status: "PENDING" },
        }),
        prisma.task.count({
            where: { status: { in: ["APPROVED", "REJECTED"] } },
        }),
    ]);

    return (
        <main>
            <h1 className="mb-4 text-xl md:text-2xl">
                Welcome, {session?.user?.name || "User"}
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-indigo-50 p-2 shadow-sm">
                    <div className="flex p-4">
                        <h3 className="ml-2 text-sm font-medium text-indigo-900">My Pending Tasks</h3>
                    </div>
                    <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl font-bold text-indigo-600">
                        {myPendingCount}
                    </p>
                </div>
                <div className="rounded-xl bg-yellow-50 p-2 shadow-sm">
                    <div className="flex p-4">
                        <h3 className="ml-2 text-sm font-medium text-yellow-900">Total Pending</h3>
                    </div>
                    <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl font-bold text-yellow-600">
                        {allPendingCount}
                    </p>
                </div>
                <div className="rounded-xl bg-green-50 p-2 shadow-sm">
                    <div className="flex p-4">
                        <h3 className="ml-2 text-sm font-medium text-green-900">Total Completed</h3>
                    </div>
                    <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl font-bold text-green-600">
                        {completedCount}
                    </p>
                </div>
            </div>
        </main>
    );
}
