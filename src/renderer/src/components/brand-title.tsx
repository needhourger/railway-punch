import React from 'react'
import { DarkToggle } from './dark-toggle'

export default function BrandTitle(): React.JSX.Element {
  return (
    <div className="w-full flex justify-between items-baseline gap-4 py-8">
      <div></div>
      <div className="text-5xl font-bold">智铁台账</div>
      {/* <div className="text-5xl font-bold">Test</div> */}
      <DarkToggle />
    </div>
  )
}
