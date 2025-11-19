import Link from "next/link";
import { Task, User } from "@prisma/client";

interface TaskListProps {
    tasks: (Task & { assignee: User | null })[];
    emptyMessage?: string;
}

export default function TaskList({ tasks, emptyMessage = "No tasks found." }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-10">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
                <Link
                    key={task.id}
                    href={`/dashboard/tasks/${task.id}`}
                    className="block rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900">
                            {(task.data as any).title}
                        </h3>
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${task.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : task.status === "APPROVED"
                                    ? "bg-green-100 text-green-800"
                                    : task.status === "REJECTED"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-blue-100 text-blue-800"
                                }`}
                        >
                            {task.status}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                        {(task.data as any).description}
                    </p>
                    <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                        <span>Submitted: {new Date(task.submittedAt).toLocaleDateString()}</span>
                        <span>
                            {task.assignee ? (
                                <span className="text-indigo-600 font-medium">Assigned to: {task.assignee.name}</span>
                            ) : (
                                <span className="text-gray-400">Unassigned</span>
                            )}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
