import type { FC } from 'react'
import Link from 'next/link'

export const Banner: FC = () => {
  return (
    <section className="py-12 md:py-16 border-b border-zinc-300 border-solid dark:bg-zinc-900 dark:border-zinc-600">
      <div className="md:max-w-4xl lg:max-w-7xl text-center ml-auto mr-auto w-11/12">
        <h1 className="font-bold text-4xl md:text-6xl mb-6 text-black dark:text-white">
          Welcome to M3O
        </h1>
        <h2 className="text-md md:text-lg max-w-xl mx-auto text-zinc-700 dark:text-zinc-400 font-medium">
          The community based super app built for developers
        </h2>
        <div className="mt-6">
          <Link href="https://play.google.com/store/apps/details?id=com.m3o.mobile">
          <a class="inline-flex w-48 h-14 bg-black text-white rounded-lg items-center justify-center w-full btn md:w-auto md:mx-auto border hover:no-underline">
            <div class="mr-3">
                <svg viewBox="30 336.7 120.9 129.2" width="30">
                    <path fill="#FFD400" d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z"/>
                    <path fill="#FF3333" d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z"/>
                    <path fill="#48FF48" d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z"/>
                    <path fill="#3BCCFF" d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z"/>
                </svg>
            </div>
            <div>
              <div class="text-xs text-white">GET IT ON</div>
              <div class="text-xl font-semibold font-sans -mt-1 text-white">Google Play</div>
            </div>
          </a>
          </Link>
        </div>
      </div>
    </section>
  )
}
