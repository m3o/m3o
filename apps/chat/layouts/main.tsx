import Link from 'next/link'
import { PropsWithChildren } from 'react'

export function MainLayout({ children }: PropsWithChildren<unknown>) {
    return (
        <>
            <header className="py-2 px-4 flex justify-between">
                <Link href="/">
                    <img
                        src="/logo.png"
                        height="35px"
                        width="35px"
                        alt="Logo"
                    />
                </Link>
                <Link
                    href="/logout"
                    className="text-sm text-black hover:underline"
                >
                    Logout
                </Link>
            </header>
            {children}
        </>
    )
}
