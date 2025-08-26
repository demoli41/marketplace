import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import React, { useState } from 'react'

const CheckoutForm = ({
    clientSecret,
    cartItems,
    couponCode,
    sessionId,
}:{
    clientSecret: string;
    cartItems: any[];
    couponCode: any;
    sessionId: string | null;
}) => {

    const stripe=useStripe();
    const elements=useElements();

    const [loading, setLoading] = useState(false);
    const [status,setStatus]=useState<"success" | "failed" | null>(null);
    const [errorMsg,setErrorMsg]=useState<string | null>(null);

    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        if(!stripe || !elements){
            setLoading(false);
            return;
        }

        const result=await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success?sessionId=${sessionId}`,
            },
        });

        if(result.error){
            setErrorMsg(result.error.message || "Сталася помилка при обробці платежу.");
            setStatus("failed");
        } else {
            setStatus("success");
        }

        setLoading(false);
    }

    const total=cartItems.reduce(
        (sum,item) => sum + item.quantity * item.sale_price, 0
    );

  return (
    <div className='flex justify-center items-center min-h-[80vh] px-4 my-10'>
        <form 
        onSubmit={handleSubmit}
        className='bg-white w-full max-w-lg p-8 rounded-md shadow space-y-6'>
            <h2 className='text-3xl font-bold text-center mb-2'>
                Безпечна оплата
            </h2>

            {/*Order summary */}
            <div className='bg-gray-100 p-4 rounded-md text-sm text-gray-700 space-y-6'>
                {cartItems.map((item,idx)=>(
                    <div key={idx} className='flex justify-between text-sm pb-1'>
                        <span>
                            {item.quantity} x {item.title}
                        </span>
                        <span>{(item.quantity * item.sale_price)?.toFixed(2)} грн</span>
                    </div>
                ))}

                <div className='flex justify-between font-semibold pt-2 border-t border-t-gray-100'>
                    {couponCode && couponCode?.discountAmount!==0 && (
                        <>
                        <span>Знижка:</span>
                        <span className='text-green-600'>
                            -{(couponCode?.discountAmount)?.toFixed(2)} грн
                        </span>
                        </>
                    )}
                </div>

                <div className='flex justify-between font-semibold mt-2'>
                    <span>Разом:</span>
                    <span>
                        {(total-couponCode?.discountAmount)?.toFixed(2)} грн
                    </span>
                </div>
            </div>

            <PaymentElement/>
            <button
            type='submit'
            disabled={!stripe || loading}
            className='w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center'
            >
                {loading && <Loader2 className='animate-spin size-5' />}
                {loading ? "Обробка..." : "Оплатити"}
            </button>

            {errorMsg && (
                <div className='flex items-center gap-2 text-red-600 text-sm justify-center'>
                    <XCircle className=' size-5' />
                    {errorMsg}
                </div>
            )}

            {status === "success" && (
                <div className='flex items-center gap-2 text-green-600 text-sm justify-center'>
                    <CheckCircle className=' size-5' />
                    Платіж успішно оброблено!
                </div>
            )}

            {status === "failed" && (
                <div className='flex items-center gap-2 text-red-600 text-sm justify-center'>
                    <XCircle className=' size-5' />
                    Платіж не вдалося обробити. Спробуйте ще раз.
                </div>
            )}
        </form>
    </div>
  );
};

export default CheckoutForm