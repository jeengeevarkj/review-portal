"use client";

import { createUser } from "@/app/lib/user-actions";
import Link from "next/link";
import { useActionState } from "react";

export default function CreateUserPage() {
    const initialState = { message: "", errors: {} };
    const [state, dispatch] = useActionState(createUser, initialState);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Create User
                    </h2>
                </div>
            </div>

            <form action={dispatch} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Name
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    {state.errors?.name && (
                        <p className="mt-2 text-sm text-red-600">{state.errors.name}</p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Email
                    </label>
                    <div className="mt-2">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            placeholder="john@example.com"
                            required
                        />
                    </div>
                    {state.errors?.email && (
                        <p className="mt-2 text-sm text-red-600">{state.errors.email}</p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Password
                    </label>
                    <div className="mt-2">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            required
                        />
                    </div>
                    {state.errors?.password && (
                        <p className="mt-2 text-sm text-red-600">{state.errors.password}</p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="role"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Role
                    </label>
                    <div className="mt-2">
                        <select
                            id="role"
                            name="role"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        >
                            <option value="VIEWER">Viewer</option>
                            <option value="REVIEWER">Reviewer</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-x-6">
                    <Link
                        href="/dashboard/users"
                        className="text-sm font-semibold leading-6 text-gray-900"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Create User
                    </button>
                </div>
                {state.message && (
                    <p className="mt-2 text-sm text-red-600 text-center">{state.message}</p>
                )}
            </form>
        </div>
    );
}
