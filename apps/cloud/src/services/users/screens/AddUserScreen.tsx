import type { FC } from 'react'
import type { Account } from 'm3o/user'
import { PlusIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Heading1 } from '../../../components/Headings/Heading1'
import { TextInput } from '../../../components/Form/TextInput'
import { BackButtonLink } from '../../../components/Buttons/BackButtonLink'
import { useAddUser } from '../hooks/useAddUser'
import { Modal } from '../../../components/Modal'
import { AddProfileField } from '../components/AddProfileField'

interface CreateUserFields extends Account {
  password: string
}

export const AddUserScreen: FC = () => {
  const [addProfileField, setAddProfileField] = useState(false)
  const { mutate } = useAddUser()
  const { control, handleSubmit } = useForm<CreateUserFields>()

  return (
    <section className="p-6">
      <BackButtonLink to="/users">Back to users</BackButtonLink>
      <Heading1>Add User</Heading1>
      <form
        onSubmit={handleSubmit((values: CreateUserFields) => mutate(values))}
        className="max-w-lg"
      >
        <h2 className="mt-6 font-bold">Details</h2>
        <Controller
          control={control}
          name="email"
          defaultValue=""
          render={({ field }) => (
            <TextInput
              {...field}
              label="Email"
              className="my-6"
              placeholder="e.g john@smith.me"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          defaultValue=""
          render={({ field }) => (
            <TextInput
              {...field}
              label="Password"
              className="mb-6"
              type="password"
            />
          )}
        />
        <div className="flex justify-between items-center">
          <h2 className="mt-6 font-bold mb-6">Extra Details</h2>
          <button
            className="p-2 rounded-full bg-indigo-600"
            onClick={() => setAddProfileField(true)}
          >
            <PlusIcon className="w-4" />
          </button>
        </div>
        <button className="btn" type="submit">
          Submit
        </button>
      </form>
      {addProfileField && (
        <Modal handleClose={() => setAddProfileField(false)}>
          <AddProfileField />
        </Modal>
      )}
    </section>
  )
}
