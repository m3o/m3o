import type { FC, ChangeEvent } from 'react'
import type { ModalProps } from '@/components/ui'
import { useState } from 'react'
import { TextInput, Button, Alert, Modal } from '@/components/ui'
import { useCreateKey, useListApis } from '@/hooks'
import { ScopesSelect } from './ScopesSelect'

export const CreateAPIKeyModal: FC<ModalProps> = props => {
  const createKey = useCreateKey()
  const [description, setDescription] = useState('')
  const [selectedScopes, setSelectedScopes] = useState<string[]>([])
  const { data = [] } = useListApis()

  const onScopeSelect = (scope: string) => {
    setSelectedScopes(prevScopes => {
      if (prevScopes.includes(scope)) {
        return prevScopes.filter(item => item !== scope)
      }

      return [...prevScopes, scope]
    })
  }

  const onDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value)
  }

  const onCreate = () => {
    createKey.mutate({
      description,
      scopes: selectedScopes,
    })
  }
  return (
    <Modal {...props}>
      <h1 className="font-black text-black text-lg mb-4 dark:text-white">
        Generate a token
      </h1>
      {!createKey.data && (
        <>
          <TextInput
            label="Description"
            name="description"
            labelClass="font-medium text-base"
            required={true}
            onChange={onDescriptionChange}
            onBlur={onDescriptionChange}
          />
          <ScopesSelect
            options={data.map(item => item.name)}
            selectedOptions={selectedScopes}
            onScopeSelect={onScopeSelect}
          />
          <Button
            className="mt-4 dark:text-white"
            disabled={!description}
            onClick={onCreate}
            loading={createKey.isLoading}>
            Generate
          </Button>
        </>
      )}
      {createKey.data && (
        <>
          <Alert type="warning" className="my-4">
            Please copy this to a safe place as this is the only time you will
            see it.
          </Alert>
          <div className="font-mono text-sm mt-4 p-4 bg-zinc-800 text-indigo-300 rounded-md overflow-x-scroll">
            {createKey.data.api_key}
          </div>
          <Button className="mt-4" onClick={props.closeModal}>
            Done
          </Button>
        </>
      )}
    </Modal>
  )
}
