'use client';

import React, { useEffect, useState } from 'react'
import { Appearance, loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import {  XCircle } from 'lucide-react';
import CheckoutForm from 'apps/user-ui/src/shared/widgets/header/components/checkout/checkoutForm';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const Page = () => {
    const [clientSecret, setClientSecret] = useState('');
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [couponCode, setCouponCode] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter(); 

    const sessionId = searchParams.get('sessionId');

    useEffect(()=>{
        const fetchSessionAndClientSecret=async()=>{
            if(!sessionId){
                setError("Некорректный ідентифікатор сессії");
                setLoading(false);
                return;
            }

            try {
                const verifyRes=await axiosInstance.get(
                    `/order/api/verifying-payment-session?sessionId=${sessionId}`
                );

                const {totalAmount,sellers,cart, coupon}=verifyRes.data.session;

                if(
                    !sellers ||
                    sellers.length===0 ||
                    totalAmount===undefined ||
                    totalAmount===null
                ){
                    throw new Error("Некорректні дані сесії");
                }

                setCartItems(cart);
                setCouponCode(coupon);
                console.log(sellers[0]);
                const sellerStripeAccountId = sellers[0].stripeId;

                const intentRes=await axiosInstance.post("/order/api/create-payment-intent",{
                    amount: coupon?.discountAmount
                    ? totalAmount - coupon?.discountAmount
                    : totalAmount,
                    sellerStripeAccountId,
                    sessionId,
                });

                setClientSecret(intentRes.data.clientSecret);
            } catch (err:any) {
                console.log(err);
                setError("Щось пішло не так при створенні платіжного наміру");
            } finally{
                setLoading(false);
            }
        };

        fetchSessionAndClientSecret();
    }, [sessionId]);

    const appearance:Appearance = {
        theme: 'stripe',
    };

    if(loading){
        return (
        <div className='flex justify-center items-center min-h-[70vh]'>
            <div className='animate-spin rounded-full h-12 w-12 border-4border-blue-900'></div>
        </div>);
    }

    if(error){
        return(
            <div className='flex justify-center items-center min-h-[60vh] px-4'>
                <div className="w-full text-center">
                    <div className='flex justify-center mb-4'>
                        <XCircle className='text-red-500 size-10' />
                    </div>
                    <h2 className='text-xl font-semibold text-red-600 mb-2'>
                        Платіж не вдався
                    </h2>
                    <p className='text-sm text-gray-600 mb-6'>
                        {error} <br className='hidden sm:block'/>Будь ласка, спробуйте ще раз.
                    </p>
                    <button
                    onClick={()=>router.push('/cart')}
                    className='bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-transparent'
                    >
                        Повернутися до кошика
                    </button>
                </div>
            </div>
        );
    }

  return (
    clientSecret && (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,
                appearance,
            }}
        >
            <CheckoutForm 
            clientSecret={clientSecret}
            cartItems={cartItems}
            couponCode={couponCode}
            sessionId={sessionId}
            />
        </Elements>
    )
  )
}

export default Page