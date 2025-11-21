import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Check if users already exist
        const count = await prisma.user.count();
        if (count > 0) {
            return NextResponse.json({ message: "Database already seeded" });
        }

        const hashedPassword = await bcrypt.hash("password123", 10);

        // Create Admin
        await prisma.user.create({
            data: {
                email: "admin@example.com",
                name: "Admin User",
                password: hashedPassword,
                role: "ADMIN",
            },
        });

        // Create Manager (Reviewer)
        await prisma.user.create({
            data: {
                email: "manager@example.com",
                name: "Manager User",
                password: hashedPassword,
                role: "REVIEWER",
            },
        });

        // Create Employee (Viewer)
        await prisma.user.create({
            data: {
                email: "employee@example.com",
                name: "Employee User",
                password: hashedPassword,
                role: "VIEWER",
            },
        });

        return NextResponse.json({ message: "Database seeded successfully!" });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({
            error: "Failed to seed database",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
