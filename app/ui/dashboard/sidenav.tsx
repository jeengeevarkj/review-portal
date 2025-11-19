import Link from "next/link";
import { LogOut, Command } from "lucide-react";
import { logout } from "@/app/lib/actions";
import { auth } from "@/auth";
import NavLinks from "@/app/ui/dashboard/nav-links";

export default async function SideNav() {
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";

    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-white border-r border-gray-200">
            <Link
                className="mb-4 flex h-20 items-center justify-start rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 p-4 md:h-24 shadow-lg transform transition-transform hover:scale-[1.02]"
                href="/"
            >
                <div className="flex items-center gap-3 text-white">
                    <Command className="w-8 h-8" />
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-wide">Review Portal</span>
                        <span className="text-xs text-indigo-100 font-medium">Enterprise Edition</span>
                    </div>
                </div>
            </Link>

            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <NavLinks isAdmin={isAdmin} />

                <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>

                <form action={logout}>
                    <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors md:flex-none md:justify-start md:p-2 md:px-3">
                        <LogOut className="w-6" />
                        <div className="hidden md:block">Sign Out</div>
                    </button>
                </form>
            </div>
        </div>
    );
}
