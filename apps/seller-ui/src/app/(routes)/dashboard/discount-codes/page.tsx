
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DeleteDiscountCodeModal from 'apps/seller-ui/src/shared/components/modals/delete.discount-codes';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import { AxiosError } from 'axios';
import { ChevronRight, PlusIcon, Trash, X } from 'lucide-react'
import Link from 'next/link';
import Input from 'packages/components/input/input';
import React, { useState } from 'react'
import { Controller,  useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const Page = () => {

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState<any>();

    const queryClient = useQueryClient();

    const { data: discountCodes = [], isLoading } = useQuery({
        queryKey: ["shop-discounts"],
        queryFn: async () => {
            const res = await axiosInstance.get('/product/api/get-discount-codes');
            return res?.data?.discount_codes || [];
        },
    });

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            public_name: '',
            discountType: 'percentage',
            discountValue: '',
            discountCode: '',
        },
    });

    const createDiscountCodeMutation = useMutation({
        mutationFn: async (data) => {
            await axiosInstance.post('/product/api/create-discount-code', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shop-discounts"] });
            reset();
            setShowModal(false);
        },
    });

    const deleteDiscountCodeMutation = useMutation({
        mutationFn:async (discountId: string) => {
            await axiosInstance.delete(`/product/api/delete-discount-code/${discountId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shop-discounts"] });
            setShowDeleteModal(false);
            toast.success("Код знижки успішно видалено");
        },
    })

    const handleDeleteClick = async (discount: any) => {
        setSelectedDiscount(discount);
        setShowDeleteModal(true);
    }

    const onSubmit = async (data: any) => {
        if (discountCodes.length >= 8) {
            toast.error("Ви можете створити лише 8 кодів знижок");
            return;
        }
        createDiscountCodeMutation.mutate(data);
    };

    return (
        <div className='w-full min-h-screen p-8'>
            <div className='flex justify-between items-center mb-1'>
                <h2 className='text-2xl text-white font-semibold  font-Poppins'>
                    Коди знижок
                </h2>
                <button
                    onClick={() => setShowModal(true)}
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2'>
                    <PlusIcon size={18} />Створити новий код
                </button>
            </div>
            {/*Breadcrumbs*/}
            <div className='flex items-center text-white'>
                <Link href={"/dashboard"} className='text-[#80Deea] cursor-pointer'>Dashboard</Link>
                <ChevronRight size={20} className='opacity-[.8]' />
                <span className=''>Discount Codes</span>
            </div>

            {/*Your discount codes */}
            <div className='mt-8 bg-gray-900 p-6 rounded-lg shadow-lg'>
                <h3 className='text-lg text-white font-semibold mb-4'>
                    Ваші коди знижок
                </h3>
                {isLoading ? (
                    <p className='text-white'>Завантаження знижок...</p>
                ) : (
                    <table className='w-full text-white'>
                        <thead>
                            <tr className='border-b border-gray-800'>
                                <th className='p-3 text-left'>
                                    Назва коду
                                </th>
                                <th className='p-3 text-left'>
                                    Тип
                                </th>
                                <th className='p-3 text-left'>
                                    Значення
                                </th>
                                <th className='p-3 text-left'>
                                    Код
                                </th>
                                <th className='p-3 text-left'>
                                    Дія
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {discountCodes?.map((discount: any) => (
                                <tr key={discount?.id} className='border-b border-gray-800 hover:bg-gray-800 transition'>
                                    <td className='p-3'>
                                        {discount?.public_name}
                                    </td>
                                    <td className='p-3 capitalize'>
                                        {discount.discountType === 'percentage' ? 'Відсоток (%)' : 'Фіксована сума ($)'}
                                    </td>
                                    <td className='p-3 capitalize'>
                                        {discount.discountType === 'percentage' ? `${discount.discountValue}%` : `$${discount.discountValue}`}
                                    </td>
                                    <td className='p-3'>
                                        {discount.discountCode}
                                    </td>
                                    <td className='p-3'>
                                        <button
                                            onClick={() => handleDeleteClick(discount)}
                                            className='text-red-400 hover:text-red-300 transition'>
                                            <Trash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {!isLoading && discountCodes?.length === 0 && (
                    <p className='text-gray-400 pt-4 text-center'>
                        Немає доступних кодів знижок.
                    </p>
                )}
            </div>

            {/*Modal for creating new discount code*/}
            {showModal && (
                <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='bg-gray-800 p-6 rounded-lg w-[450px] shadow-lg'>
                        <div className='flex justify-between items-center border-b border-gray-700 pb-3'>
                            <h3 className='text-xl text-white'>Створити код на знижку</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className='text-gray-400 hover:text-white transition'>
                                <X size={22} />
                            </button>
                        </div>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className='mt-4'
                        >
                            {/*Title*/}
                            <Input
                            label='Назва коду'
                            {...register('public_name', { required: 'Це поле обов’язкове' })}
                            />
                            {errors.public_name && (
                                <p className='text-red-500 text-sm mt-1'>
                                    {errors.public_name.message}
                                </p>
                            )}

                            {/*Discount Type*/}
                            <div className='mt-2'>
                                <label className='block font-semibold text-gray-400 mb-1'>
                                    Тип
                                </label>
                                <Controller
                                control={control}
                                name='discountType'
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className='w-full border outline-none border-gray-700 bg-transparent text-gray-600 px-3 py-2 rounded-lg'
                                    >
                                        <option value='percentage'>Відсоток (%)</option>
                                        <option value='flat'>Фіксована сума ($)</option>
                                    </select>
                                )}
                                />
                            </div>

                            {/*Discount Value*/}
                            <div className='mt-2'>
                                <Input 
                                label='Значення'                       
                                type='number'
                                min={1}
                                {...register('discountValue', {
                                    required: 'Це поле обов’язкове',  
                                })}                              
                                />
                            </div>

                            {/*Discount Code*/}
                            <div className='mt-2'>
                                <Input
                                    label='Код'
                                    {...register('discountCode', {
                                        required: 'Це поле обов’язкове',
                                    })}
                                />
                            </div>
                                <button
                                type='submit'
                                disabled={createDiscountCodeMutation.isPending}
                                className='mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold flex items-center justify-center gap-2'
                                >
                                <PlusIcon size={18} />
                                {createDiscountCodeMutation.isPending ? 'Створення...' : 'Створити'}
                                </button>

                                {createDiscountCodeMutation.isError && (
                                    <p className='text-red-500 text-sm mt-2'>
                                       {(
                                        createDiscountCodeMutation.error as AxiosError<{
                                             message: string;
                                        }>
                                    )?.response?.data?.message || 'Помилка при створенні коду знижки'}
                                    </p>
                                )}
                        </form>
                    </div>
                </div>
            )}

            {/*Delete Confirmation Modal*/}
            {showDeleteModal && selectedDiscount && (
                <DeleteDiscountCodeModal
                discount={selectedDiscount}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={()=>deleteDiscountCodeMutation.mutate(selectedDiscount?.id)}                
                />
            )}

        </div>
    )
}

export default Page