import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { auth } from "@/auth";
import TaskList from "@/app/ui/dashboard/task-list";

const prisma = new PrismaClient();

export default async function TaskListPage() {
    const session = await auth();
    const userId = session?.user?.id;

    const [myTasks, allTasks] = await Promise.all([
        userId
            ? prisma.task.findMany({
                where: { assigneeId: userId },
                orderBy: { submittedAt: "desc" },
                include: { assignee: true },
            })
            : [],
        prisma.task.findMany({
            orderBy: { submittedAt: "desc" },
            include: { assignee: true },
        }),
    ]);

    return (
        <div className="w-full space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tasks</h1>
                {session?.user?.role === "ADMIN" && (
                    <Link
                        href="/dashboard/tasks/create"
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                    >
                        Create Task
                    </Link>
                )}
            </div>

            {/* My Inbox Section */}
            <section>
                <h2 className="text-lg font-semibold mb-4 text-indigo-700">My Inbox</h2>
                <TaskList tasks={myTasks} emptyMessage="You have no assigned tasks." />
            </section>

            {/* All Tasks Section */}
            <section>
                <h2 className="text-lg font-semibold mb-4 text-gray-700">All Tasks</h2>
                <TaskList tasks={allTasks} />
            </section>
        </div>
    );
}
