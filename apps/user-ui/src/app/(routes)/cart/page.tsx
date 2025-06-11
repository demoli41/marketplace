'use client';

import useDeviceTracking from 'apps/user-ui/src/hooks/useDeviceTracking';
import useLocationTracking from 'apps/user-ui/src/hooks/useLocationTracking';
import useUser from 'apps/user-ui/src/hooks/useUser';
import { useStore } from 'apps/user-ui/src/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

const CartPage = () => {

    const router = useRouter();
    const { user } = useUser();
    const location = useLocationTracking();
    const deviceInfo = useDeviceTracking();
    const cart = useStore((state: any) => state.cart);
    const removeItem = useStore((state: any) => state.removeFromCart);
    const [discountedProductId, setDiscountedProductId] = useState('');
    const [discountPercent, setDiscountPercent] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [selectedAddressId, setSelectedAddressId] = useState('');

    const [loading, setLoading] = useState(false);

    const decreaseQuantity = (id: string) => {
        useStore.setState((state: any) => ({
            cart: state.cart.map((item: any) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item),
        }));
    };

    const increaseQuantity = (id: string) => {
        useStore.setState((state: any) => ({
            cart: state.cart.map((item: any) =>
                item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item),
        }));
    };

    const subtotal = cart.reduce(
        (total: number, item: any) => total + item.quantity * item.sale_price, 0
    )

    return (
        <div className='w-full bg-white'>
            <div className='md:w-[80%] w-[95%] mx-auto min-h-screen'>
                <div className='pb-[50px]'>
                    <h1 className='md:pt-[50px] font-medium text-[44px] leading-1 mb-[16px] font-Jost'>Кошик</h1>
                    {/*Breadcrumbs */}
                    <Link
                        href={"/"}
                        className='text-[##55585b] hover:underline'
                    >
                        Головна
                    </Link>
                    <span className='inline-block p-[1.5px] mx-1 bg-[#a8acb0] rounded-full'></span>
                    <span className='text-[#55585b]'>Кошик</span>
                </div>

                {cart.length === 0 ? (<div className='text-center text-gray-600 text-lg'>
                    Ваш кошик порожній.
                </div>) : (
                    <div className='lg:flex items-start gap-10'>
                        <table className='w-full lg:w-[70%] border-collapse'>
                            <thead className='bg-[#f1f3f4] rounded-[4px] '>
                                <tr>
                                    <th className='py-3 text-left pl-4'>Товар</th>
                                    <th className='py-3 text-left'>Ціна</th>
                                    <th className='py-3 text-left'>Кількість</th>
                                    <th className='py-3 text-left'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item: any) => (
                                    <tr key={item.id} className='border-b border-b-[#0000000e]'>
                                        <td className='p-4 flex items-center gap-4'>
                                            <Image
                                                src={item?.images[0]?.url} alt={item.title} width={80}
                                                height={80} className='rounded-2xl'
                                            />
                                            <div className='flex flex-col'>
                                                <span className='font-medium'>{item.title}</span>
                                                {item?.selectedOptions && (
                                                    <div className='text-sm text-gray-500'>
                                                        {item?.selectedOptions?.color && (
                                                            <span>
                                                                Колір: { }
                                                                <span
                                                                    style={{
                                                                        backgroundColor: item?.selectedOptions?.color,
                                                                        width: '12px',
                                                                        height: '12px', borderRadius: '100%',
                                                                        display: 'inline-block',
                                                                    }} />
                                                            </span>

                                                        )}
                                                        {item?.selectedOptions?.size && (
                                                            <span className='ml-2'>
                                                                Розмір: {item?.selectedOptions?.size}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className='px-6 text-lg text-center' >
                                            {item?.id === discountedProductId ? (
                                                <div className='flex flex-col items-center '>
                                                    <span className='line-through text-gray-500 text-sm'>
                                                        {item?.sale_price.toFixed(2)} ₴
                                                    </span>{" "}
                                                    <span className='text-green-600 font-semibold'>
                                                        {((
                                                            item?.sale_price * (100 - discountPercent)) /
                                                            100).toFixed(2)} ₴
                                                    </span>
                                                    <span className='text-xs text-green-700 bg-white'>
                                                        Знижка {discountPercent}%
                                                    </span>
                                                </div>
                                            ) : (
                                                <span>
                                                    {item?.sale_price.toFixed(2)} ₴
                                                </span>
                                            )}
                                        </td>
                                        <td >
                                            <div className='flex justify-center items-center border border-gray-200 rounded-[20px] w-[90px] p-[2px]'>
                                                <button className='text-black cursor-pointer text-xl'
                                                    onClick={() => decreaseQuantity(item?.id)}
                                                >
                                                    -
                                                </button>
                                                <span className='px-4'>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    className='text-black cursor-pointer text-xl'
                                                    onClick={() => increaseQuantity(item?.id)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className='text-center'>
                                            <button
                                                className='text-[#818487] cursor-pointer hover:text-[#ff1826] transition duration-200'
                                                onClick={() => removeItem(item?.id)}                                            >
                                                Видалити
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                        <div className='p-6 shadow-md w-full lg:w-[30%] bg-[#f9f9f9] rounded-lg'>
                            {discountAmount > 0 && (
                                <div className='flex justify-between items-center text-[#010f1c] text-base font-medium pb-1'>
                                    <span className='font-Jost'>
                                        Знижка ({discountPercent}%)
                                    </span>
                                    <span className='text-green-600'>
                                        - {discountAmount.toFixed(2)} ₴
                                    </span>
                                </div>
                            )}

                            <div className='flex justify-between items-center text-[#010f1c] text-base font-[550] pb-3'>
                                <span className='font-jost'>Всього</span>
                                <span className='text-[#2295FF] font-semibold'>
                                    {(subtotal - discountAmount).toFixed(2)} ₴
                                </span>
                            </div>
                            <hr className='my-4 text-slate-200' />

                            <div className='mb-4 '>
                                <h4 className='mb-[7px] font-medium text-[15px]'>
                                    Маєте промокод?
                                </h4>
                                <div className='flex'>
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e: any) => setCouponCode(e.target.value)}
                                        placeholder='Введіть промокод'
                                        className='w-full p-2 border border-gray-200 rounded-l-md focus:outline-none focus:border-blue-500'
                                    />
                                    <button
                                        className='bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors'
                                    //onClick={() => couponCodeapply}
                                    >
                                        Застосувати
                                    </button>
                                    {/*error && (
                                        <p className='text-red-500 text-sm pt-2'>
                                            {error}
                                        </p>
                                    )*/}
                                </div>
                                <hr className='my-4 text-slate-200' />
                                <div className='mb-4 '>
                                    <h4 className='mb-[7px] font-medium text-[15px]'>
                                        Оберіть адресу доставки
                                    </h4>
                                    <select className='w-full p-2 border border-gray-200 rounded-l-md focus:outline-none focus:border-blue-500'
                                        value={selectedAddressId}
                                        onChange={(e) => setSelectedAddressId(e.target.value)}
                                    >
                                        <option value="123">
                                            Home - New York - USA
                                        </option>
                                    </select>
                                </div>
                                <hr className='my-4 text-slate-200' />
                                <div className='mb-4 '>
                                    <h4 className='mb-[7px] font-medium text-[15px]'>
                                        Оберіть метод оплати
                                    </h4>
                                    <select className='w-full p-2 border border-gray-200 rounded-l-md focus:outline-none focus:border-blue-500'
                                    >
                                        <option value="credit_card">
                                            Оплата онлайн карткою
                                        </option>
                                        <option value="cash_on_delivery">
                                            Готівкою при отриманні
                                        </option>
                                    </select>
                                </div>
                                <hr className='my-4 text-slate-200' />

                                <div className='flex justify-between items-center text-[#010f1c] text-[20px] font-[550] pb-3'>
                                    <span className='font-jost'>Підсумок</span>
                                    <span className='text-[#2295FF] font-semibold'>
                                        {(subtotal - discountAmount).toFixed(2)} ₴
                                    </span>
                                </div>

                                <button
                                    className='w-full flex items-center justify-center bg-[#2295FF] text-white gap-2 mt-4-4 py-3 rounded-md hover:bg-blue-600 transition-colors'
                                    disabled={loading}
                                >
                                    {loading && <Loader2 className='animate-spin w-5 h-5'/>}
                                    {loading ? 'Перенаправлення...' : 'Оформити замовлення'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartPage