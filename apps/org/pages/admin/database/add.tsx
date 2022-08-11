import type { CreateRequest } from 'm3o/db'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { PlusIcon, TrashIcon } from '@heroicons/react/outline'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { DashboardLayout } from '@/components/layouts'
import { withAuth } from '@/lib/api/m3o/withAuth'
import seo from '@/lib/seo.json'
import { TextInput, Button, BackButtonLink } from '@/components/ui'
import { useM3OClient } from '@/hooks'

type RecordItem = {
  key: string
  value: string
}

type FormData = {
  table: string
  record: RecordItem[]
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

export default function CloudDatabaseAdd() {
  const router = useRouter()
  const m3o = useM3OClient()

  const createDatabaseMutation = useMutation(
    (payload: CreateRequest) => m3o.db.create(payload),
    {
      onSuccess: () => {
        router.push('/admin/database')
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
      <NextSeo {...seo.admin.database.add} />
      <DashboardLayout>
        <div className="p-6 md:p-10 max-w-xl">
          <BackButtonLink href="/admin/database">
            Back to database
          </BackButtonLink>
          <h1 className="text-3xl font-medium mb-6 gradient-text">
            Add Table
          </h1>
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
                  label="Name"
                  {...field}
                  error={fieldState.error?.message}
                />
              )}
            />
            <h2 className="mb-6 mt-6 font-medium">
              Create a first record by specifying key-value pairs
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
