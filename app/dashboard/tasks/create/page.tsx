"use client";

import { useActionState } from "react";
import { createTask } from "@/app/lib/task-actions";

type ActionState = {
    message: string;
    errors?: {
        title?: string[];
        description?: string[];
    };
};

export default function CreateTaskPage() {
    const initialState: ActionState = { message: "", errors: {} };
    const [state, dispatch] = useActionState(createTask, initialState);

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
            <form action={dispatch} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        required
                    />
                    {state.errors?.title && (
                        <p className="mt-2 text-sm text-red-600">{state.errors.title}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Content for review
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        required
                    />
                    {state.errors?.description && (
                        <p className="mt-2 text-sm text-red-600">{state.errors.description}</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Create Task
                    </button>
                </div>
                {state.message && (
                    <p className="mt-2 text-sm text-red-600">{state.message}</p>
                )}
            </form>
        </div>
    );
}
