'use client';

import { useStore } from 'apps/user-ui/src/store';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import confetti from 'canvas-confetti';
import { CheckCircle, Truck } from 'lucide-react';



const PaymentSuccessPage = () => {
    const searchParams=useSearchParams();
    const sessionId=searchParams.get('sessionId');
    const router=useRouter();

    //Clear cart and trigger confetti
    useEffect(()=>{
        useStore.setState({cart:[]});

        confetti({
            particleCount:120,
            spread:90,
            origin:{y:0.6}
        })
    },[])

  return (
    <div className='min-h-[80vh] flex items-center justify-center px-4'>
      <div className='bg-white items-center justify-center shadow-sm border border-gray-200 rounded-lg p-6'>
        <div className='text-green-500 mb-4'>
            <CheckCircle className='size-16 mx-auto' />
        </div>
        <h2 className='text-2xl font-semibold text-gray-800 text-center mb-2'>
            Платіж успішний!
        </h2>
        <p className='text-sm text-center text-gray-600 mb-6'>
            Дякуємо за вашу покупку! Ваше замовлення обробляється.
        </p>

        <div className='flex justify-center'>
          <button 
          onClick={()=>router.push('/profile?active=Мої+замовлення')}
          className='inline-flex  items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md'>
              <Truck className='size-4' />
              Відстежити замовлення
          </button>
        </div>

        <div className='mt-8 text-xs text-gray-400'>
            ID платіжної сесії: <span className='font-mono'>{sessionId}</span>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessPage