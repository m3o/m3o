import type { Func } from 'm3o/function'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useRouter } from 'next/router'
import { withAuth } from '@/lib/api/m3o/withAuth'
import { DashboardLayout } from '@/components/layouts'
import { QueryKeys } from '@/lib/constants'
import { useM3OClient } from '@/hooks'
import { Tabs, FullSpinner } from '@/components/ui'
import { FunctionEditAndCreate, FunctionLogs } from '@/components/pages/Cloud'

export const getServerSideProps = withAuth(async context => {
  if (!context.req.user) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }

  return {
    props: {
      user: context.req.user,
    },
  }
})

export default function EditFunction() {
  const m3o = useM3OClient()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(
    [QueryKeys.CloudFunctions, router.query.id],
    async () => {
      const response = await m3o.function.list({})

      return (response.functions || []).find(
        item => item.id === router.query.id,
      )
    },
  )

  const updateFunctionMutation = useMutation(
    (values: Func) =>
      m3o.function.update({
        name: values.name,
        source: values.source,
      }),
    {
      onSuccess: () => {
        // Reload the fetch function
        queryClient.invalidateQueries([
          QueryKeys.CloudFunctions,
          router.query.id,
        ])
      },
    },
  )

  if (isLoading || !data) {
    return <FullSpinner />
  }

  return (
    <DashboardLayout>
      <Tabs>
        {data.source ? (
          <div title="Function">
            <div className="px-6">
              <FunctionEditAndCreate
                {...data}
                onSubmit={(values: Func) =>
                  updateFunctionMutation.mutate(values)
                }
                submitButtonText="Update"
              />
            </div>
          </div>
        ) : (
          <div title="Overview"></div>
        )}
        <div title="Logs">
          <div className="px-6">
            <FunctionLogs />
          </div>
        </div>
      </Tabs>
    </DashboardLayout>
  )
}
