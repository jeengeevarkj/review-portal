const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    const users = [
        { email: 'reviewer1@example.com', name: 'Reviewer One', role: 'REVIEWER' },
        { email: 'reviewer2@example.com', name: 'Reviewer Two', role: 'REVIEWER' },
        { email: 'admin2@example.com', name: 'Admin Two', role: 'ADMIN' },
        { email: 'viewer1@example.com', name: 'Viewer One', role: 'VIEWER' },
    ];

    for (const user of users) {
        try {
            const createdUser = await prisma.user.upsert({
                where: { email: user.email },
                update: {},
                create: {
                    email: user.email,
                    name: user.name,
                    password,
                    role: user.role,
                },
            });
            console.log(`Created/Updated user: ${createdUser.email} (${createdUser.role})`);
        } catch (e) {
            console.error(`Error creating user ${user.email}:`, e);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
