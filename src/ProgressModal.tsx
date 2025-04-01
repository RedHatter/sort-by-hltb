import { ConfirmModal, ProgressBar } from "@decky/ui"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { abort, store } from "./cacheQueue"

type ProgressModalProps = {
  closeModal?: () => void
}

const ProgressModal: FC<ProgressModalProps> = ({ closeModal }) => {
  const { queue, total } = useStore(store)

  const cancel = () => {
    closeModal?.()
    abort()
  }

  return (
    <ConfirmModal
      strTitle="Please wait"
      onOK={cancel}
      onCancel={cancel}
      strOKButtonText="Cancel"
      bAlertDialog
      strDescription={`Loading HLTB data for ${total} games.`}
    >
      <div style={{ marginTop: "16px" }}>
        <ProgressBar nTransitionSec={0} nProgress={((total - queue.length) / total) * 100} />
      </div>
    </ConfirmModal>
  )
}

export default ProgressModal
