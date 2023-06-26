import { MainLayout } from '@/components/layouts'

function BackendPage() {
  return (
    <MainLayout>
      <section className="px-4 md:px-0 py-12 md:py-36 text-zinc-600 dark:text-zinc-400">
        <div className="md:max-w-4xl lg:max-w-7xl mx-auto w-11/12 mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-6 max-w-2xl dark:text-white font-bold gradient-text">
            The easiest way to integrate APIs into your product
          </h1>
          <h2 className="text-md md:text-lg lg:text-xl font-medium max-w-3xl mx-auto">
            This is the sub title
            {/* {subHeading} */}
          </h2>
          <p className="font-mono inline-block  rounded-md text-sm mt-10 text-white">
            npm install m3o
          </p>
        </div>
      </section>
    </MainLayout>
  )
}

export default BackendPage
