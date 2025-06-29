// 'use client';
// import { Button } from '@/components/ui/button'
// import React from 'react'
// import { Toaster } from '@/components/ui/sonner'

// function page() {
//   return (
//     <div className='flex flex-col items-center justify-center h-screen w-full'>
//         <SonnerDemo/>
//     </div>
//   )
// }

// export default page

// export function SonnerDemo() {
//   return (
//     <Button
//       variant="outline"
//       onClick={() =>
//         <Toaster closeButton={true} position={'top-center'}/>
//       }
//     >
//       Show Toast
//     </Button>
//   )
// }


'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'


export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <SonnerDemo />
      <Toaster closeButton position="top-center" />
      <Toaster closeButton position="bottom-right" />
    </div>
  )
}

export function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() => toast('This is a toast!')}
    >
      Show Toast
    </Button>
  )
}
