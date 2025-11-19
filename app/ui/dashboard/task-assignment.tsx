"use client";

import { useState } from "react";
import { assignTask } from "@/app/lib/task-actions";
import { User } from "@prisma/client";

interface TaskAssignmentProps {
    taskId: string;
    currentAssigneeId: string | null;
    currentUserId: string;
    reviewers: Pick<User, "id" | "name" | "email">[];
}

export default function TaskAssignment({
    taskId,
    currentAssigneeId,
    currentUserId,
    reviewers,
}: TaskAssignmentProps) {
    const [isAssigning, setIsAssigning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAssign = async (assigneeId: string) => {
        setError(null);
        const result = await assignTask(taskId, assigneeId);
        if (result?.message && result.message !== "Success") {
            setError(result.message);
        } else {
            setIsAssigning(false);
        }
    };

    if (currentAssigneeId) {
        const assignee = reviewers.find((r) => r.id === currentAssigneeId);
        return (
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Assigned to:</span>
                <span className="text-sm font-medium text-gray-900">
                    {assignee?.name || "Unknown User"}
                </span>
                {(currentUserId === currentAssigneeId || reviewers.some(r => r.id === currentUserId)) && (
                    <button
                        onClick={() => setIsAssigning(!isAssigning)}
                        className="text-xs text-indigo-600 hover:text-indigo-500 ml-2"
                    >
                        Change
                    </button>
                )}
                {isAssigning && (
                    <div className="absolute mt-8 bg-white border rounded shadow-lg p-2 z-10">
                        {reviewers.map((reviewer) => (
                            <button
                                key={reviewer.id}
                                onClick={() => handleAssign(reviewer.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                {reviewer.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => handleAssign(currentUserId)}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
                Accept Task
            </button>
            <div className="relative">
                <button
                    onClick={() => setIsAssigning(!isAssigning)}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                    Assign to...
                </button>
                {isAssigning && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-1 z-10">
                        {reviewers.map((reviewer) => (
                            <button
                                key={reviewer.id}
                                onClick={() => handleAssign(reviewer.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                {reviewer.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-red-600 ml-2">{error}</p>}
        </div>
    );
}
