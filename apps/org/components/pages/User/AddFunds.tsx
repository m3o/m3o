import type { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextInput, Select, Button } from '@/components/ui'
import { useGetSavedCards, useChargeCard } from '@/hooks'

export interface AddFundsFormFields {
  amount: number
  cardId: string
}

export const AddFunds: FC = () => {
  const mutation = useChargeCard()
  const { handleSubmit, control } = useForm<AddFundsFormFields>()

  const { cards } = useGetSavedCards()

  return (
    <div className="mt-8 tbgc p-6 md:p-10 rounded-lg">
      <h3 className="font-bold text-2xl text-black mb-3 dark:text-white">
        Add Credit
      </h3>
      <p className="ttc">1 credit = £1 (5% fees)</p>
      <form
        className="mt-4 md:grid md:grid-cols-5 md:gap-4 items-center max-w-3xl"
        onSubmit={handleSubmit((values: AddFundsFormFields) =>
          mutation.mutate(values),
        )}>
        <div className="col-span-2">
          <Controller
            control={control}
            name="amount"
            defaultValue={10}
            rules={{
              min: {
                value: 10,
                message: 'Please specify an amount of 10 or above',
              },
            }}
            render={({ field: { ref, ...fieldProps }, fieldState }) => (
              <TextInput
                label="Amount"
                {...fieldProps}
                error={fieldState.error?.message}
                type="number"
              />
            )}
          />
        </div>
        <div className="col-span-2">
          <Controller
            control={control}
            name="cardId"
            rules={{
              required: {
                value: true,
                message: 'Please select a payment card',
              },
            }}
            render={({ field: { ref, ...fieldProps }, fieldState }) => (
              <Select
                {...fieldProps}
                error={fieldState.error?.message}
                label="Select card"
                options={cards.map(card => ({
                  name: `**** ${card.last_four}, expires ${card.expires}`,
                  value: card.id,
                }))}
              />
            )}
          />
        </div>
        <Button
          type="submit"
          className="mt-3 border"
          loading={mutation.isLoading}>
          Add
        </Button>
      </form>
    </div>
  )
}
