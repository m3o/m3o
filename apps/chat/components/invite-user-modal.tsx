import { useForm } from 'react-hook-form'
import { useInviteUser } from '@/lib/api/groups'
import { Button } from './button'
import { Input } from './form/input'
import { Modal, type ModalProps } from './modal'

type CreateTopicFormFields = { email: string }

export function InviteUserModal({
    groupId,
    ...rest
}: ModalProps & { groupId: string }) {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<CreateTopicFormFields>()
    const { mutate, isLoading } = useInviteUser(groupId)

    return (
        <Modal {...rest}>
            <h3 className="font-medium text-xl mb-4">Invite User</h3>
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
                    {...register('email', {
                        required: 'Please provide the email address',
                    })}
                    label="Email address"
                    placeholder="Please provide an email address"
                    error={errors.email?.message}
                />
                <Button showLoader={isLoading}>Submit</Button>
            </form>
        </Modal>
    )
}
