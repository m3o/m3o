import type { PropsWithChildren } from 'react'
import { Header } from '../components/header'
import { CenteredLoader } from '../components/loader'

export function GroupLayout({
    children,
    showLoader,
}: PropsWithChildren<{ showLoader: boolean }>) {
    return (
        <>
            <Header />
            {showLoader ? <CenteredLoader /> : children}
        </>
    )
}
