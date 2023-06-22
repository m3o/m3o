import { useForm } from 'react-hook-form'
import { useCreateTopic } from '@/lib/api/topics'
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
    const { mutate, isLoading } = useCreateTopic(groupId)

    return (
        <Modal {...rest}>
            <h3 className="font-medium text-xl mb-4">Add Topic</h3>
            <form
                onSubmit={handleSubmit((values) => {
                    mutate(values, {
                        onSuccess() {
                            rest.onClose()
                        },
                    })
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
