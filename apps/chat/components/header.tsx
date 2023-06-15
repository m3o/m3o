import Link from 'next/link'

export function Header() {
    return (
        <header className="py-2 px-4 flex justify-between border-b border-zinc-200">
            <Link href="/">
                <img src="/logo.png" height="35px" width="35px" alt="Logo" />
            </Link>
            <Link href="/logout" className="text-sm text-black hover:underline">
                Logout
            </Link>
        </header>
    )
}
