import type { PropsWithChildren } from 'react'
import { Header } from '../components/header'
import { CenteredLoader } from '../components/loader'

export function GroupLayout({
    children,
    showLoader,
}: PropsWithChildren<{ showLoader: boolean }>) {
    return (
        <div className="h-full">
            <Header />
            <div className="h-[calc(100%-54px)]">
                {showLoader ? <CenteredLoader /> : children}
            </div>
        </div>
    )
}
