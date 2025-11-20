"use server";

import { auth } from "@/auth";
import { PrismaClient, TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { logAudit } from "@/lib/audit";

const prisma = new PrismaClient();

const CreateTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
});

export async function createTask(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return { message: "Unauthorized", errors: {} };
    }

    const validatedFields = CreateTaskSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Task.",
        };
    }

    const { title, description } = validatedFields.data;

    try {
        const task = await prisma.task.create({
            data: {
                data: { title, description },
                status: TaskStatus.PENDING,
            },
        });

        if (session.user?.id) {
            await logAudit({
                action: "TASK_CREATED",
                entity: "Task",
                entityId: task.id,
                userId: session.user.id,
                details: { title, description },
            });
        }
    } catch (error) {
        return { message: "Database Error: Failed to Create Task.", errors: {} };
    }

    revalidatePath("/dashboard/tasks");
    redirect("/dashboard/tasks");
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
    const session = await auth();
    if (!session) return { message: "Unauthorized" };

    try {
        const commentsCount = await prisma.comment.count({
            where: { taskId },
        });

        if (commentsCount === 0) {
            return { message: "Please add a comment before approving or rejecting." };
        }

        await prisma.task.update({
            where: { id: taskId },
            data: { status },
        });

        if (session.user?.id) {
            await logAudit({
                action: "TASK_UPDATED",
                entity: "Task",
                entityId: taskId,
                userId: session.user.id,
                details: { status },
            });
        }
    } catch (error) {
        return { message: "Database Error: Failed to Update Task." };
    }

    revalidatePath(`/dashboard/tasks/${taskId}`);
    revalidatePath("/dashboard/tasks");

    if (status === TaskStatus.REJECTED || status === TaskStatus.APPROVED) {
        redirect("/dashboard/tasks");
    }

    return { message: "Success" };
}

export async function addComment(taskId: string, content: string) {
    const session = await auth();
    if (!session || !session.user?.email) return { message: "Unauthorized" };

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) return { message: "User not found" };

        const comment = await prisma.comment.create({
            data: {
                content,
                taskId,
                userId: user.id,
            },
        });

        await logAudit({
            action: "COMMENT_ADDED",
            entity: "Comment",
            entityId: comment.id,
            userId: user.id,
            details: { content, taskId },
        });
        revalidatePath(`/dashboard/tasks/${taskId}`);
        return { message: "Success" };
    } catch (error) {
        return { message: "Database Error: Failed to Add Comment." };
    }
}

export async function assignTask(taskId: string, assigneeId: string) {
    const session = await auth();
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "REVIEWER")) {
        return { message: "Unauthorized" };
    }

    try {
        await prisma.task.update({
            where: { id: taskId },
            data: { assigneeId },
        });

        if (session.user?.id) {
            await logAudit({
                action: "TASK_ASSIGNED",
                entity: "Task",
                entityId: taskId,
                userId: session.user.id,
                details: { assigneeId },
            });
        }
        revalidatePath(`/dashboard/tasks/${taskId}`);
        revalidatePath("/dashboard/tasks");
        return { message: "Success" };
    } catch (error) {
        return { message: "Database Error: Failed to Assign Task." };
    }
}

export async function getReviewers() {
    const session = await auth();
    if (!session) return [];

    try {
        const reviewers = await prisma.user.findMany({
            where: {
                OR: [
                    { role: "REVIEWER" },
                    { role: "ADMIN" }
                ]
            },
            select: { id: true, name: true, email: true },
        });
        return reviewers;
    } catch (error) {
        return [];
    }
}

export async function deleteTask(taskId: string) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return { message: "Unauthorized" };
    }

    try {
        await prisma.task.delete({
            where: { id: taskId },
        });

        if (session.user?.id) {
            await logAudit({
                action: "TASK_DELETED",
                entity: "Task",
                entityId: taskId,
                userId: session.user.id,
            });
        }
        revalidatePath("/dashboard/tasks");
        return { message: "Success" };
    } catch (error) {
        return { message: "Database Error: Failed to Delete Task." };
    }
}
