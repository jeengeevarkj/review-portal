import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const apiKey = req.headers.get("x-api-key");
    const apiSecret = process.env.API_SECRET;

    if (!apiSecret || apiKey !== apiSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, content } = body;

        if (!title || !content) {
            return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
        }

        const task = await prisma.task.create({
            data: {
                status: "PENDING",
                data: {
                    title,
                    description: JSON.stringify(content), // Store content as JSON string
                },
            },
        });

        return NextResponse.json({ id: task.id, status: task.status }, { status: 201 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
