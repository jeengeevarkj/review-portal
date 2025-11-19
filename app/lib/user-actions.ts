"use server";

import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CreateUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["ADMIN", "REVIEWER", "VIEWER"]),
});

export async function createUser(prevState: any, formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        return { message: "Unauthorized" };
    }

    const validatedFields = CreateUserSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create User.",
        };
    }

    const { name, email, password, role } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });
    } catch (error) {
        return { message: "Database Error: Failed to Create User." };
    }

    revalidatePath("/dashboard/users");
    redirect("/dashboard/users");
}

export async function deleteUser(userId: string) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        return { message: "Unauthorized" };
    }

    try {
        // Check if user has assigned tasks
        const assignedTasksCount = await prisma.task.count({
            where: { assigneeId: userId },
        });

        if (assignedTasksCount > 0) {
            return { message: "Cannot delete user. They have assigned tasks." };
        }

        await prisma.user.delete({
            where: { id: userId },
        });
        revalidatePath("/dashboard/users");
        return { message: "Success" };
    } catch (error) {
        return { message: "Database Error: Failed to Delete User." };
    }
}

export async function getUsers() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        return [];
    }

    try {
        const users = await prisma.user.findMany({
            orderBy: { name: "asc" },
        });
        return users;
    } catch (error) {
        return [];
    }
}

const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
});

export async function changePassword(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: "Unauthorized" };
    }

    const validatedFields = ChangePasswordSchema.safeParse({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmNewPassword: formData.get("confirmNewPassword"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation Error",
        };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id as string },
        });

        if (!user || !user.password) {
            return { message: "User not found" };
        }

        const passwordsMatch = await bcrypt.compare(currentPassword, user.password);

        if (!passwordsMatch) {
            return {
                errors: { currentPassword: ["Incorrect password"] },
                message: "Incorrect current password",
            };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: session.user.id as string },
            data: { password: hashedPassword },
        });

        return { message: "Password updated successfully" };
    } catch (error) {
        return { message: "Database Error: Failed to update password." };
    }
}
