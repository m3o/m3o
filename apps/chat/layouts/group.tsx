import Link from 'next/link'
// import { useRouter } from 'next/router'
import type { PropsWithChildren } from 'react'
import { useGroups } from '@/lib/group'
import { CenteredLoader } from '../components/loader'
import { AuthenticatedLayout } from './authenticated'

export function GroupLayout({
    children,
    showLoader,
}: PropsWithChildren<{ showLoader: boolean }>) {
    const { data: groups } = useGroups()
    // const { query } = useRouter()

    return (
        <AuthenticatedLayout>
            <div className="h-full">
                {/* <Header /> */}
                <div className="h-full">
                    <div className="h-full flex">
                        <div className="h-full bg-zinc-50 pt-4 flex flex-col items-center">
                            <Link href="/" className="block mb-4">
                                <img
                                    src="/logo.png"
                                    height="35px"
                                    width="35px"
                                    alt="Logo"
                                />
                            </Link>
                            {groups.map((item) => (
                                <Link
                                    href={`/groups/${item.id}`}
                                    key={item.id}
                                    className="block px-4 py-1 text-sm text-zinc-300 "
                                >
                                    <span className="p-2 bg-black rounded-full w-9 h-9 flex items-center">
                                        <img src="https://m3o.com/logo-white.png" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                        {showLoader ? <CenteredLoader /> : children}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
