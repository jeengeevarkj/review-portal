"use client";

import { useState } from "react";
import { deleteUser } from "@/app/lib/user-actions";
import { useRouter } from "next/navigation";

export default function DeleteUserButton({ userId }: { userId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this user?")) {
            return;
        }

        setIsDeleting(true);
        const result = await deleteUser(userId);

        if (result?.message === "Success") {
            router.refresh();
        } else {
            alert(result?.message || "Failed to delete user");
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-900 disabled:opacity-50"
        >
            {isDeleting ? "Deleting..." : "Delete"}
        </button>
    );
}
