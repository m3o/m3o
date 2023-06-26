import type { NextPage } from 'next'
import { useCallback, useState, ChangeEventHandler, useMemo } from 'react'
import cache from 'memory-cache'
import { NextSeo } from 'next-seo'
import { MainLayout } from '@/components/layouts'
import { Select, PageHeader, Tabs } from '@/components/ui'
import { withAuth, WithAuthProps } from '@/lib/api/m3o/withAuth'
import { fetchAllRanks, AllRanksResponse } from '@/lib/api/m3o/services/usage'
import { RankUser, RankApi } from '@/types'
import { TopUsersTable, TopApisTable } from '@/components/pages/Trending'
import { formatApiRanks, sortApisByPosition } from '@/utils/rankings'
import seo from '@/lib/seo.json'

interface Props extends WithAuthProps {
  initialApiName?: string
  globalTopUsers: RankUser[]
  apiRanks: RankApi[]
}

export const getServerSideProps = withAuth(async context => {
  let data: AllRanksResponse

  try {
    const cachedResponse: AllRanksResponse | undefined = cache.get('trending')

    if (cachedResponse) {
      data = cachedResponse
    } else {
      const response = await fetchAllRanks()
      data = response.data
      cache.put('trending', data, 24 * 1000 * 60 * 60)
    }

    return {
      props: {
        apiRanks: formatApiRanks(data.ranks),
        globalTopUsers: data.global_top_users,
        initialApiName: context.query.api || '',
        user: context.req.user,
      } as Props,
    }
  } catch (e) {
    // Do something with the error
    return {
      props: {},
    }
  }
})

const Trending: NextPage<Props> = ({
  apiRanks,
  globalTopUsers,
  initialApiName,
}) => {
  const [currentApiName, setCurrentApiName] = useState(initialApiName)

  const onApiSelect: ChangeEventHandler<HTMLSelectElement> = useCallback(
    event => {
      setCurrentApiName(() => event.target.value)
    },
    [],
  )

  const users = useMemo(() => {
    if (currentApiName === '') return globalTopUsers

    return (
      apiRanks.find(item => item.api_name === currentApiName)?.top_users || []
    )
  }, [currentApiName, globalTopUsers, apiRanks])

  return (
    <>
      <NextSeo {...seo.trending} canonical="https://m3o.com/trending" />
      <MainLayout>
        <PageHeader
          title="Trending"
          subTitle="See the most popular APIs and users using them"
        />
        <section className="bg-zinc-50 pb-8 dark:bg-zinc-900">
          <div className="m3o-container pt-6">
            <Tabs initialTabIndex={initialApiName ? 1 : 0}>
              <div title="APIs" className="mt-6">
                <TopApisTable apis={sortApisByPosition(apiRanks)} />
              </div>
              <div title="Users">
                <div className="max-w-lg mt-8">
                  <Select
                    label="See user rankings for:"
                    name="apiName"
                    onChange={onApiSelect}
                    value={currentApiName}
                    showPleaseSelect={false}
                    options={[
                      { name: 'All', value: '' },
                      ...apiRanks.map(item => ({
                        name: item.api_display_name,
                        value: item.api_name,
                      })),
                    ]}
                  />
                </div>
                <div className="mt-6">
                  <TopUsersTable users={users} />
                </div>
              </div>
            </Tabs>
          </div>
        </section>
      </MainLayout>
    </>
  )
}

export default Trending
