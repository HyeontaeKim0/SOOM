"use client";

import { Modal, useOverlayState } from "@heroui/react";
import type { UseOverlayStateReturn } from "@heroui/react";

export { useOverlayState };
export type { UseOverlayStateReturn };

interface DeleteConfirmModalProps {
  state: UseOverlayStateReturn;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => void | Promise<void>;
}

export default function DeleteConfirmModal({
  state,
  title = "정말 삭제하시겠어요?",
  description = "이 작업은 되돌릴 수 없습니다.",
  confirmLabel = "삭제",
  cancelLabel = "취소",
  isPending = false,
  onConfirm,
}: DeleteConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable={!isPending}>
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog className="bg-[#FBF7F3] rounded-2xl p-6 md:p-8">
            <Modal.Header className="flex justify-end">
              <Modal.CloseTrigger
                className="text-[#8C8478] hover:text-[#2A241D] transition-colors text-xl disabled:opacity-40 disabled:cursor-not-allowed"
                isDisabled={isPending}
              />
            </Modal.Header>

            <Modal.Body className="flex flex-col items-center gap-3 pb-2 text-center">
              <Modal.Heading className="text-lg font-bold text-[#2A241D]">
                {title}
              </Modal.Heading>
              <p className="text-sm text-[#8C8478]">{description}</p>
            </Modal.Body>

            <Modal.Footer className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={state.close}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#E0D9D0] text-[#6B6358] hover:bg-[#F5F0EB] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPending ? "삭제 중..." : confirmLabel}
              </button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
