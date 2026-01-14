"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, DollarSign } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isProcessing: boolean
  type: "reroll" | "tip" | "sponsor"
  amount: number
  description: string
}

export function PaymentModal({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  type,
  amount,
  description,
}: PaymentModalProps) {
  const typeLabels = {
    reroll: "reroll",
    tip: "tip",
    sponsor: "sponsor",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            confirm payment
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="bg-muted rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{typeLabels[type]}</span>
              <span className="font-bold text-lg">{amount.toFixed(2)} USDC</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isProcessing} className="rounded-2xl">
            cancel
          </Button>
          <Button onClick={onConfirm} disabled={isProcessing} className="rounded-2xl">
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                processing...
              </>
            ) : (
              "pay"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
