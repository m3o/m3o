import type {
  FunctionEditSourceProps,
  RepoFunctionEditProps,
} from '@/components/pages/Admin'
import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useRouter } from 'next/router'
import { withAuth } from '@/lib/api/m3o/withAuth'
import { DashboardLayout } from '@/components/layouts'
import { QueryKeys } from '@/lib/constants'
import { useM3OClient } from '@/hooks'
import { FullSpinner } from '@/components/ui'

type UpdateFuncFields = {
  name: string
  source?: string
}

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

const SourceCodeFunctionEdit = dynamic<FunctionEditSourceProps>(
  () => import('@/components/pages/Admin').then(mod => mod.FunctionEditSource),
  {
    ssr: false,
  },
)

const RepoCodeFunctionEdit = dynamic<RepoFunctionEditProps>(
  () => import('@/components/pages/Admin').then(mod => mod.RepoFunctionEdit),
  {
    ssr: false,
  },
)

export default function EditFunction() {
  const sourceCodeRef = useRef('')
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

  useEffect(() => {
    if (data?.source) {
      sourceCodeRef.current = data.source
    }
  }, [data])

  const updateFunctionMutation = useMutation(
    (values: UpdateFuncFields) => {
      return m3o.function.update(values)
    },
    {
      onSuccess: () => {
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

  function renderContent() {
    if (data!.source) {
      return (
        <SourceCodeFunctionEdit
          func={data!}
          onSubmit={sourceCode =>
            updateFunctionMutation.mutate({
              source: sourceCode,
              name: data!.name!,
            })
          }
          isUpdating={updateFunctionMutation.isLoading}
        />
      )
    }

    return (
      <RepoCodeFunctionEdit
        func={data!}
        onUpdateClick={(values: UpdateFuncFields) =>
          updateFunctionMutation.mutate(values)
        }
        isUpdating={updateFunctionMutation.isLoading}
      />
    )
  }

  return (
    <DashboardLayout>
      {isLoading || !data ? <FullSpinner /> : renderContent()}
    </DashboardLayout>
  )
}
