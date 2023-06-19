import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/button'
import { Input } from '../../components/form/input'
import { MainLayout } from '../../layouts/main'
import { api } from '../../lib/api'

type NewGroupFields = {
    name: string
    paid: boolean
}

export default function Page() {
    const router = useRouter()
    const { register, handleSubmit } = useForm<NewGroupFields>()

    const { mutate, isLoading } = useMutation({
        mutationFn: (values: NewGroupFields) => {
            return api.post<{ group: { id: string } }>('/groups', values)
        },
        onSuccess(response) {
            router.push(`/groups/${response.data.group.id}`)
        },
    })

    return (
        <MainLayout>
            <h1 className="font-black text-black text-3xl mb-10">
                Create a group
            </h1>

            <form
                onSubmit={handleSubmit((values) => {
                    mutate(values)
                })}
            >
                <Input
                    {...register('name', {
                        required: 'Please provide the name of the group',
                    })}
                    label="Group name"
                />
                <label className="block mb-10">
                    <input type="checkbox" {...register('paid')} />
                    Would you like users to have to pay to enter the chat?
                </label>
                <Button type="submit" showLoader={isLoading}>
                    Create
                </Button>
            </form>
        </MainLayout>
    )
}
