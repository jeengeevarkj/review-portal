"use client";

import { changePassword } from "@/app/lib/user-actions";
import { useActionState } from "react";

export default function SettingsPage() {
    const initialState = { message: "", errors: {} };
    const [state, dispatch] = useActionState(changePassword, initialState);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Settings
                    </h2>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                        Change Password
                    </h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Ensure your account is using a long, random password to stay secure.</p>
                    </div>
                    <form action={dispatch} className="mt-5 space-y-4">
                        <div>
                            <label
                                htmlFor="currentPassword"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Current Password
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="currentPassword"
                                    id="currentPassword"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                    required
                                />
                            </div>
                            {state.errors?.currentPassword && (
                                <p className="mt-2 text-sm text-red-600">
                                    {state.errors.currentPassword}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                New Password
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="newPassword"
                                    id="newPassword"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                    required
                                />
                            </div>
                            {state.errors?.newPassword && (
                                <p className="mt-2 text-sm text-red-600">
                                    {state.errors.newPassword}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="confirmNewPassword"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Confirm New Password
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    id="confirmNewPassword"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                    required
                                />
                            </div>
                            {state.errors?.confirmNewPassword && (
                                <p className="mt-2 text-sm text-red-600">
                                    {state.errors.confirmNewPassword}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-x-6">
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Change Password
                            </button>
                        </div>
                        {state.message && (
                            <p
                                className={`mt-2 text-sm text-center ${state.message === "Password updated successfully"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                            >
                                {state.message}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
