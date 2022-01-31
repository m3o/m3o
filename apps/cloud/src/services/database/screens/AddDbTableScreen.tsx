import type { FC, ChangeEvent } from 'react'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { PlusIcon, TrashIcon } from '@heroicons/react/outline'
import { BackButtonLink } from '../../../components/Buttons/BackButtonLink'
import { Heading1 } from '../../../components/Headings/Heading1'
import { TextInput } from '../../../components/Form/TextInput'
import { useCreateDb } from '../hooks/useCreateDb'
import { Routes } from '../../../constants'

interface CreateRecordRowFields {
  key: string
  value: string
}

export const AddDbTableScreen: FC = () => {
  const [tableName, setTableName] = useState('')
  const [record, setRecord] = useState<Record<string, any>>({})
  const { handleSubmit, control, reset } = useForm<CreateRecordRowFields>()
  const hasRecordRows = !!Object.keys(record).length
  const { mutate } = useCreateDb()

  function handleTableNameChange(e: ChangeEvent<HTMLInputElement>): void {
    setTableName(e.target.value)
  }

  function handleAddRecordRowSubmit({
    key,
    value
  }: CreateRecordRowFields): void {
    if (record[key]) {
      // show a local error
    }

    setRecord((prevState) => ({
      ...prevState,
      [key]: value
    }))

    reset()
  }

  function handleRecordRowDelete(key: string): void {
    setRecord((prevState) => {
      const newState = { ...prevState }
      delete newState[key]
      return newState
    })
  }

  function handleCreateClick(): void {
    mutate({ record, table: tableName })
  }

  return (
    <section className="p-6">
      <BackButtonLink to={Routes.Database}>Back to DB</BackButtonLink>
      <Heading1>Add database table</Heading1>
      <div className="mt-10 max-w-lg">
        <h2 className="mb-6 mt-10 text-xl">
          <span className="w-6 h-6 mr-2 bg-gradient-to-r from-indigo-800 via-purple-500 to-pink-500 text-center rounded-full inline-flex items-center justify-center text-black text-sm">
            1
          </span>
          Please enter the name of your table
        </h2>
        <TextInput
          label="Table Name"
          name="tableName"
          onChange={handleTableNameChange}
        />
        <h2 className="mb-6 mt-10 text-xl">
          <span className="w-6 h-6 mr-2 bg-gradient-to-r from-indigo-800 via-purple-500 to-pink-500 text-center rounded-full inline-flex items-center justify-center text-black text-sm">
            2
          </span>
          Please enter the fields for your first database item
        </h2>
        <form onSubmit={handleSubmit(handleAddRecordRowSubmit)}>
          <div className="flex items-center">
            <Controller
              control={control}
              defaultValue=""
              name="key"
              render={({ field }) => (
                <TextInput {...field} label="Key" placeholder="e.g firstName" />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
              name="value"
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Value"
                  className="ml-4"
                  placeholder="e.g Elon"
                />
              )}
            />
            <button
              className="btn h-14 ml-4 mt-1"
              type="submit"
              data-testid="add-database-row-btn"
            >
              <PlusIcon className="w-4" />
            </button>
          </div>
        </form>
        {hasRecordRows && (
          <div className="mb-10">
            <div className="grid grid-cols-8">
              <div className="p-4 col-span-3">Key</div>
              <div className="p-4 col-span-3">Value</div>
              <div className="p-4">&nbsp;</div>
            </div>
            {Object.entries(record).map(([key, value]) => (
              <div
                key={key}
                className="bg-zinc-800 rounded-lg grid grid-cols-8 items-center mb-3"
              >
                <div className="p-4 col-span-3">{key}</div>
                <div className="p-4 col-span-3">{value}</div>
                <div className="p-4 text-right">
                  <button onClick={() => handleRecordRowDelete(key)}>
                    <TrashIcon className="w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        className="btn"
        disabled={!tableName || !hasRecordRows}
        data-testid="add-db-table-button"
        onClick={handleCreateClick}
      >
        Create
      </button>
    </section>
  )
}
