"use client";

import { useState } from "react";
import { deleteTask } from "@/app/lib/task-actions";
import { useRouter } from "next/navigation";

export default function DeleteTaskButton({ taskId }: { taskId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
            return;
        }

        setIsDeleting(true);
        const result = await deleteTask(taskId);

        if (result?.message === "Success") {
            router.push("/dashboard/tasks");
        } else {
            alert(result?.message || "Failed to delete task");
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
        >
            {isDeleting ? "Deleting..." : "Delete Task"}
        </button>
    );
}
