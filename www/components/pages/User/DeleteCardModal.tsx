import type { FC } from 'react'
import { Button, Modal } from '@/components/ui'
import { useDeleteCard } from '@/hooks'
import { useBillingContext } from '@/providers'

export const DeleteCardModal: FC = () => {
  const deleteCard = useDeleteCard()
  const { cardToDelete, setCardToDelete } = useBillingContext()

  return (
    <Modal open={!!cardToDelete} closeModal={() => setCardToDelete(undefined)}>
      <h5 className=" text-black dark:text-white">
        Are you sure you would like to delete this payment method?
      </h5>
      <Button
        onClick={() => deleteCard.mutate()}
        loading={deleteCard.isLoading}
        className="mt-6">
        Submit
      </Button>
    </Modal>
  )
}
