import type { FC } from 'react'
import type { ModalProps } from '@/components/ui'
import { Button, Modal } from '@/components/ui'
import { useRevokeKey } from '@/hooks'

interface Props extends ModalProps {
  deleteKeyId: string
}

export const DeleteKeyConfirmationModal: FC<Props> = ({
  deleteKeyId,
  ...props
}) => {
  const revokeKey = useRevokeKey({
    onSuccess: () => {
      props.closeModal && props.closeModal()
    },
  })

  return (
    <Modal {...props}>
      <h2 className="font-black text-black text-xl mb-4 dark:text-white">
        Are you sure you want to delete this token?
      </h2>
      <Button
        onClick={() => revokeKey.mutate(deleteKeyId)}
        loading={revokeKey.isLoading}>
        Confirm
      </Button>
    </Modal>
  )
}
