"use client";

import { Home, ListTodo, Settings, Users, ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Tasks", href: "/dashboard/tasks", icon: ListTodo },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function NavLinks({ isAdmin }: { isAdmin: boolean }) {
    const pathname = usePathname();

    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-indigo-100 hover:text-indigo-600 md:flex-none md:justify-start md:p-2 md:px-3",
                            {
                                "bg-indigo-100 text-indigo-600": pathname === link.href,
                                "bg-gray-50": pathname !== link.href,
                            }
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}

            {isAdmin && (
                <>
                    <Link
                        href="/dashboard/users"
                        className={clsx(
                            "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-indigo-100 hover:text-indigo-600 md:flex-none md:justify-start md:p-2 md:px-3",
                            {
                                "bg-indigo-100 text-indigo-600": pathname === "/dashboard/users",
                                "bg-gray-50": pathname !== "/dashboard/users",
                            }
                        )}
                    >
                        <Users className="w-6" />
                        <p className="hidden md:block">Users</p>
                    </Link>
                    <Link
                        href="/dashboard/audit-logs"
                        className={clsx(
                            "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-indigo-100 hover:text-indigo-600 md:flex-none md:justify-start md:p-2 md:px-3",
                            {
                                "bg-indigo-100 text-indigo-600": pathname === "/dashboard/audit-logs",
                                "bg-gray-50": pathname !== "/dashboard/audit-logs",
                            }
                        )}
                    >
                        <ClipboardList className="w-6" />
                        <p className="hidden md:block">Audit Logs</p>
                    </Link>
                </>
            )}
        </>
    );
}
