import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting audit log verification...");

    // 1. Find or create a test user
    let user = await prisma.user.findFirst({
        where: { email: "test-audit@example.com" },
    });

    if (!user) {
        console.log("Creating test user...");
        user = await prisma.user.create({
            data: {
                email: "test-audit@example.com",
                name: "Test Audit User",
                role: "ADMIN",
            },
        });
    }

    console.log(`Using user: ${user.id}`);

    // 2. Create an audit log entry manually (simulating the service)
    console.log("Creating audit log entry...");
    const logEntry = await prisma.auditLog.create({
        data: {
            action: "TEST_ACTION",
            entity: "TestEntity",
            entityId: "test-id-123",
            userId: user.id,
            details: JSON.stringify({ foo: "bar" }),
        },
    });

    console.log(`Created audit log: ${logEntry.id}`);

    // 3. Verify it exists
    const fetchedLog = await prisma.auditLog.findUnique({
        where: { id: logEntry.id },
    });

    if (fetchedLog) {
        console.log("✅ Verification SUCCESS: Audit log found in database.");
        console.log(fetchedLog);
    } else {
        console.error("❌ Verification FAILED: Audit log not found.");
        process.exit(1);
    }

    // Cleanup
    await prisma.auditLog.delete({ where: { id: logEntry.id } });
    // Optional: delete user if created, but keeping it might be useful for re-runs
    // await prisma.user.delete({ where: { id: user.id } });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
