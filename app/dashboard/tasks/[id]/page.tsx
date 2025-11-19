import { PrismaClient, TaskStatus } from "@prisma/client";
import { auth } from "@/auth";
import { updateTaskStatus, addComment, getReviewers } from "@/app/lib/task-actions";
import { notFound } from "next/navigation";
import TaskReviewButtons from "@/app/ui/dashboard/task-review-buttons";
import TaskAssignment from "@/app/ui/dashboard/task-assignment";
import DeleteTaskButton from "@/app/ui/dashboard/delete-task-button";

const prisma = new PrismaClient();

export default async function TaskDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await auth();
    const task = await prisma.task.findUnique({
        where: { id },
        include: {
            comments: {
                include: { user: true },
                orderBy: { createdAt: "asc" },
            },
        },
    });

    const reviewers = await getReviewers();

    if (!task) {
        notFound();
    }

    const taskData = (task.data as { title?: string; description?: string }) || {};
    const title = taskData.title || "Untitled Task";
    const description = taskData.description || "No content provided.";

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            {/* Task Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Status: <span className="font-medium">{task.status}</span>
                        </p>
                    </div>
                    {/* Assignment & Reviewer Actions */}
                    <div className="flex flex-col items-end space-y-2">
                        {(session?.user?.role === "REVIEWER" || session?.user?.role === "ADMIN") && (
                            <TaskAssignment
                                taskId={task.id}
                                currentAssigneeId={task.assigneeId}
                                currentUserId={session.user.id!}
                                reviewers={reviewers}
                            />
                        )}

                        {/* Only show review buttons if assigned to current user */}
                        {task.assigneeId === session?.user?.id && (
                            <TaskReviewButtons taskId={task.id} />
                        )}

                        {/* Delete Button (Admin Only) */}
                        {session?.user?.role === "ADMIN" && (
                            <DeleteTaskButton taskId={task.id} />
                        )}
                    </div>
                </div>
                <div className="mt-6 border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-medium text-gray-900">Content for review</h3>
                    <div className="mt-2">
                        {(() => {
                            try {
                                const parsed = JSON.parse(description);
                                return (
                                    <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm text-gray-800 font-mono">
                                        {JSON.stringify(parsed, null, 2)}
                                    </pre>
                                );
                            } catch (e) {
                                return (
                                    <p className="text-gray-600 whitespace-pre-wrap">
                                        {description}
                                    </p>
                                );
                            }
                        })()}
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Comments</h2>
                <div className="space-y-4 mb-6">
                    {task.comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-3">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                    {comment.user.name?.[0] || "U"}
                                </div>
                            </div>
                            <div className="flex-grow bg-gray-50 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-900">
                                        {comment.user.name || "Unknown User"}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                    {task.comments.length === 0 && (
                        <p className="text-sm text-gray-500">No comments yet.</p>
                    )}
                </div>

                {/* Add Comment Form */}
                <form
                    action={async (formData) => {
                        "use server";
                        const content = formData.get("content") as string;
                        if (content) {
                            await addComment(task.id, content);
                        }
                    }}
                    className="mt-4"
                >
                    <div>
                        <label htmlFor="content" className="sr-only">
                            Add a comment
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            rows={3}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            placeholder="Add a comment..."
                            required
                        />
                    </div>
                    <div className="mt-3 flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Post Comment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
