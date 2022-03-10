import type { NextPage } from 'next'
import type { PricingItem } from '@/types'
import { NextSeo } from 'next-seo'
import { MainLayout } from '@/components/layouts'
import { withAuth, WithAuthProps } from '@/lib/api/m3o/withAuth'
import { fetchApiPrices } from '@/lib/api/m3o/services/explore'
import seo from '@/lib/seo.json'
import { ApiPriceBreakdown } from '@/components/pages/Pricing'
import { PageHeader, Subscriptions } from '@/components/ui'

interface PricingProps extends WithAuthProps {
  prices: PricingItem[]
}

function priceNotEqualToZero(price: string): boolean {
  return price !== '0'
}

function getPaidResults(prices: PricingItem[]): PricingItem[] {
  return prices.reduce((arr, item) => {
    const hasPaidItems = Object.keys(item.pricing).some(key =>
      priceNotEqualToZero(item.pricing[key]),
    )

    if (!hasPaidItems) {
      return arr
    }

    const pricingItems = Object.keys(item.pricing)
      .filter(key => priceNotEqualToZero(item.pricing[key]))
      .map(key => ({ [key]: item.pricing[key] }))

    return [
      ...arr,
      {
        ...item,
        pricing: Object.assign({}, ...pricingItems),
      },
    ]
  }, [] as PricingItem[])
}

export const getServerSideProps = withAuth(async context => {
  const prices = await fetchApiPrices()

  return {
    props: {
      user: context.req.user,
      prices: getPaidResults(prices),
    },
  }
})

const Pricing: NextPage<PricingProps> = ({ prices }) => {
  return (
    <>
      <NextSeo {...seo.pricing} />
      <MainLayout>
        <PageHeader
          title="Pricing"
          subTitle="Simple, straight forward, pay-as-you grow pricing"
        />
        <div className="m3o-container pt-8">
          <h2 className="font-bold text-xl md:text-4xl md:mt-8">
            Subscriptions
          </h2>
          <Subscriptions />
          <h2 className="font-bold text-xl md:text-4xl md:mt-16">
            API Pricing
          </h2>
          <div className="my-10">
            <p className="mb-4">
              The majority of our API&apos;s are{' '}
              <strong className="font-bold text-black dark:text-white">
                FREE
              </strong>{' '}
              to use, with a monthly quota to get you started.
            </p>
            <p className="mb-4 text-sm">
              Additional requests are charged at 0.000001 credit per request or in
              plain english £1 per million requests.
            </p>
          </div>
        </div>
        <section className="bg-zinc-50 min-h-screen pb-6 dark:bg-zinc-900">
          <div className="m3o-container pt-6">
            <div className="bg-white rounded-md p-6 border border-zinc-300 border-solid dark:bg-zinc-800 dark:border-zinc-600">
              <h1 className="font-bold text-2xl md:text-3xl mb-4 dark:text-white text-black">
                Paid APIs
              </h1>
              <p className="mb-4">
                Please see below for a list of our exclusively paid API&apos;s.
              </p>
              {prices.map(price => (
                <ApiPriceBreakdown key={price.id} {...price} />
              ))}
            </div>
          </div>
        </section>
      </MainLayout>
    </>
  )
}

export default Pricing
