"use client"

import { create } from "zustand"

interface ReceiptLink {
    receiptLink: string | undefined
    setReceiptLink: (receiptLink: string | undefined) => void
}

const useReceiptLink = create<ReceiptLink>()((set) => ({
    receiptLink: undefined,
    setReceiptLink: (receiptLink: string | undefined) => set({ receiptLink })
}))

export default useReceiptLink