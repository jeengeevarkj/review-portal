"use client";

import { useState } from "react";
import { updateTaskStatus } from "@/app/lib/task-actions";
import { TaskStatus } from "@prisma/client";

export default function TaskReviewButtons({ taskId }: { taskId: string }) {
    const [error, setError] = useState<string | null>(null);

    const handleAction = async (status: TaskStatus) => {
        setError(null);
        const result = await updateTaskStatus(taskId, status);
        if (result?.message && result.message !== "Success") {
            setError(result.message);
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex space-x-3">
                <button
                    onClick={() => handleAction(TaskStatus.APPROVED)}
                    className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-500"
                >
                    Approve
                </button>
                <button
                    onClick={() => handleAction(TaskStatus.REJECTED)}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
                >
                    Reject
                </button>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
