import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { api } from '../lib/api'
import { Button } from './button'
import { Input } from './form/input'
import { Modal, type ModalProps } from './modal'

type CreateTopicFormFields = { name: string }

export function AddTopicModal({
    groupId,
    ...rest
}: ModalProps & { groupId: string }) {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<CreateTopicFormFields>()
    const queryClient = useQueryClient()

    const { mutate, isLoading } = useMutation({
        async mutationFn(values: CreateTopicFormFields) {
            return api.post(`/groups/${groupId}/topics`, values)
        },
        onSuccess() {
            queryClient.invalidateQueries(['groups', groupId, 'topics'])
            rest.onClose()
        },
    })

    return (
        <Modal {...rest}>
            <h3 className="font-medium text-xl mb-4">Add Topic</h3>
            <form
                onSubmit={handleSubmit((values) => {
                    mutate(values)
                })}
            >
                <Input
                    {...register('name', {
                        required: 'Please provide your topic name',
                    })}
                    label="Name"
                    error={errors.name?.message}
                />
                <Button showLoader={isLoading}>Create</Button>
            </form>
        </Modal>
    )
}
