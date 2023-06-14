import { type PropsWithChildren } from 'react'

export function PublicLayout({ children }: PropsWithChildren<unknown>) {
    return (
        <div className="mx-auto w-11/12 md:w-full md:h-full md:grid">
            <div className="max-w-md mx-auto md:m-auto w-full pt-10 md:pt-0">
                <img
                    src="/logo.png"
                    height="75px"
                    width="75px"
                    className="mx-auto mb-2"
                    alt="Micro Logo"
                />
                <h1 className="text-center font-medium uppercase mb-6">Chat</h1>
                {children}
            </div>
        </div>
    )
}
