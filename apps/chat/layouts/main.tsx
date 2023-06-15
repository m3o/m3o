import { PropsWithChildren } from 'react'
import { Header } from '../components/header'

export function MainLayout({ children }: PropsWithChildren<unknown>) {
    return (
        <>
            <Header />
            <div className="container max-w-7xl mx-auto w-11/12 py-10 md:py-20">
                {children}
            </div>
        </>
    )
}
