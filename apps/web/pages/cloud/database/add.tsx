import type { CreateRequest } from 'm3o/db'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import { PlusIcon, TrashIcon } from '@heroicons/react/outline'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { TextInput, Button } from '@/components/ui'
import { useM3OClient } from '@/hooks'

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

interface RecordItem {
  key: string
  value: string
}

type FormData = {
  table: string
  record: RecordItem[]
}

export default function CloudDatabaseAdd() {
  const router = useRouter()
  const m3o = useM3OClient()

  const createDatabaseMutation = useMutation(
    (payload: CreateRequest) => m3o.db.create(payload),
    {
      onSuccess: () => {
        router.push('/cloud/database')
      },
    },
  )

  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      record: [{ key: '', value: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'record' })

  function onSubmit(values: FormData) {
    const record = values.record.reduce(
      (obj, item) => ({
        ...obj,
        [item.key]: item.value,
      }),
      {},
    )

    createDatabaseMutation.mutate({
      ...values,
      record,
    })
  }

  return (
    <>
      <NextSeo {...seo.cloud.users.add} />
      <DashboardLayout>
        <div className="px-8 py-6 flex justify-between items-center border-b tbc">
          <h1 className="text-3xl font-medium gradient-text flex items-center">
            <Link href="/cloud/database">
              <a className="ttc">
                <ArrowLeftIcon className="w-4 mr-4" />
              </a>
            </Link>
            Add Database
          </h1>
        </div>
        <div className="p-6 md:p-10 max-w-xl">
          <h2 className="font-medium mb-6">Details</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="table"
              control={control}
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: 'Please provide a table name',
                },
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  label="Table Name"
                  {...field}
                  error={fieldState.error?.message}
                />
              )}
            />
            <h2 className="mb-6 mt-10 font-medium">
              Please enter the fields for your first database item
            </h2>
            {fields.map((field, i) => {
              return (
                <div
                  key={field.id}
                  className="grid grid-cols-7 items-center gap-4">
                  <div className="col-span-6 grid grid-cols-2 items-center gap-4">
                    <Controller
                      control={control}
                      defaultValue=""
                      name={`record.${i}.key`}
                      rules={{
                        required: {
                          value: true,
                          message: 'Please provide a key for the item',
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <TextInput
                          {...field}
                          placeholder="Key"
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      defaultValue=""
                      name={`record.${i}.value`}
                      rules={{
                        required: {
                          value: true,
                          message: 'Please provide a value for the item',
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <TextInput
                          {...field}
                          placeholder="Value"
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                  </div>
                  <button onClick={() => remove(i)}>
                    <TrashIcon className="w-4" />
                  </button>
                </div>
              )
            })}
            <button
              type="button"
              className="btn mb-4 ml-auto self-start"
              onClick={() => append({ key: '', value: '' })}>
              <PlusIcon className="w-4" />
            </button>
            <div className="border-t tbc pt-6">
              <Button
                className="btn"
                type="submit"
                loading={createDatabaseMutation.isLoading}>
                Create
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </>
  )
}
