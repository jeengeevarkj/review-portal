import { auth } from "@/auth";

export default async function TopNav() {
    const session = await auth();

    return (
        <div className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
            <div className="text-lg font-semibold text-gray-700">
                Dashboard
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                    {session?.user?.email}
                </div>
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {session?.user?.name?.[0] || session?.user?.email?.[0]?.toUpperCase()}
                </div>
            </div>
        </div>
    );
}
