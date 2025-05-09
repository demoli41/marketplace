import { useMutation } from '@tanstack/react-query';
import { shopCategories } from 'apps/seller-ui/src/utils/categories';
import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';

const CreateShop = ({
    sellerId,
    setActiveStep,
}: {
    sellerId: string,
    setActiveStep: (step: number) => void;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const shopCreateMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-shop`, data);
            return response.data;
        },
        onSuccess: () => {
            setActiveStep(3);
        }
    });

    const onSubmit = async (data: any) => {
        const shopData = { ...data, sellerId };

        shopCreateMutation.mutate(shopData);
    };

    const countWords = (text: string) => text.trim().split(/\s+/).length;

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className=''>
                <h3 className='text-2xl font-semibold text-center mb-4'>
                    Створити новий магазин
                </h3>

                <label className='block text-gray-700 mb-1'>Назва *</label>
                <input
                    type="text"
                    placeholder='Назва магазину'
                    className='w-full p-2 border border-gary-300 outline-0 rounded-[4px] mb-1'
                    {...register("name", {
                        required: "Назва магазину є облов'язковою",
                    })}>
                    {errors.name && (
                        <p className='text-red-500 text-sm'>{String(errors.name.message)}</p>
                    )}
                </input>

                <label className='block text-gray-700 mb-1'>Опис (Максимум 100 слів) *</label>
                <input
                    type="text"
                    placeholder='Опис магазину'
                    className='w-full p-2 border border-gary-300 outline-0 rounded-[4px] mb-1'
                    {...register("bio", {
                        required: "Опис магазину є облов'язковим",
                        validate: (value) =>
                            countWords(value) <= 100 || "Опис магазину не повинен перевищувати 100 слів",
                    })}>
                    {errors.bio && (
                        <p className='text-red-500 text-sm'>{String(errors.bio.message)}</p>
                    )}
                </input>

                <label className='block text-gray-700 mb-1'>Адреса *</label>
                <input
                    type="text"
                    placeholder='Адреса'
                    className='w-full p-2 border border-gary-300 outline-0 rounded-[4px] mb-1'
                    {...register("address", {
                        required: "Адреса магазину є облов'язковою",
                        validate: (value) =>
                            countWords(value) <= 100 || "Адреса магазину не повинна перевищувати 100 слів",
                    })}>
                    {errors.address && (
                        <p className='text-red-500 text-sm'>{String(errors.address.message)}</p>
                    )}
                </input>

                <label className='block text-gray-700 mb-1'>Час роботи *</label>
                <input
                    type="text"
                    placeholder="Понеділок - П'ятниця 9:00 - 18:00"
                    className='w-full p-2 border border-gary-300 outline-0 rounded-[4px] mb-1'
                    {...register("opening_hours", {
                        required: "Час роботи магазину є облов'язковим",
                    })}>
                    {errors.opening_hours && (
                        <p className='text-red-500 text-sm'>{String(errors.opening_hours.message)}</p>
                    )}
                </input>

                <label className='block text-gray-700 mb-1'>Посилання на сайт</label>
                <input
                    type="url"
                    placeholder="https://example.com"
                    className='w-full p-2 border border-gary-300 outline-none rounded-[4px] mb-1'
                    {...register("website", {
                        pattern: {
                            value: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/,
                            message: "Введіть дійсне посилання на сайт",
                        },
                    })}>
                    {errors.website && (
                        <p className='text-red-500 text-sm'>{String(errors.website.message)}</p>
                    )}
                </input>

                <label className='block text-gray-700 mb-1'>Категорії</label>
                <select
                    className='w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1'
                    {...register("category", {
                        required: "Категорія є обов'язковою"
                    })}>
                    <option value="">Оберіть свою категорію</option>
                    {shopCategories.map((category) => (
                        <option key={category.value} value={category.value}>{category.label}
                        </option>
                    ))}
                </select>

                {errors.category && (
                    <p className='text-red-500 text-sm mb-2'>{String(errors.category.message)}</p>
                )}

                <button 
                type={"submit"}      
                className='w-full text-lg bg-blue-600 text-white py-2 rounded-lg mt-4'>
                    Створити магазин
                </button>

            </form>
        </div>
    )
}

export default CreateShop