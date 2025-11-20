import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const logs = await prisma.auditLog.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            take: 100, // Limit to last 100 logs for now
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error("[AUDIT_LOGS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
