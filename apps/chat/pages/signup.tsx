import { useForm } from 'react-hook-form'
import { Input } from '../components/form/input'

type RegisterFields = {
    firstName: string
    lastName: string
    email: string
    password: string
    passwordConfirmation: string
}

export default function Page() {
    const { register, handleSubmit } = useForm<RegisterFields>()

    return (
        <div>
            <form onSubmit={handleSubmit(console.log)}>
                <Input
                    label="First name"
                    {...register('firstName')}
                    autoFocus
                    placeholder="John"
                />
                <Input
                    label="Last name"
                    {...register('lastName')}
                    autoFocus
                    placeholder="Doe"
                />
                <Input
                    label="Email address"
                    {...register('email')}
                    autoFocus
                    placeholder="johndoe@chat.app"
                />
                <Input
                    label="Email address"
                    {...register('email')}
                    autoFocus
                    placeholder="johndoe@chat.app"
                />
            </form>
        </div>
    )
}
