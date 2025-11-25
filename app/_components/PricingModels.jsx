'use client'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


function PricingModels({children}) {
  return (
    <Dialog>
  <DialogTrigger className='w-full'>
    <div className='w-full'>{children}</div></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Upgrade Plan</DialogTitle>
      <DialogDescription>
        Upgrade Feature Will Be Added Soon...
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
  )
}

export default PricingModels