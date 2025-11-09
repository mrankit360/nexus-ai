import { Progress } from '@/components/ui/progress'
import React from 'react'

function CreditProgress() {
  return (
    <div className='p-3 border rounded-2xl mb-5 gap-2 '>
        <h2 className='font-bold text-xl'>Free Plan</h2>
        <p className='text-gray-400 '>0/20 message used</p>
        <Progress value={0} />
    </div>
  )
}

export default CreditProgress