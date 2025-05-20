'use client';
import ImagePlaceholder from 'apps/seller-ui/src/shared/components/image-placeholder';

import { ChevronRight } from 'lucide-react';
import ColorSelector from 'packages/components/color-selector';
import CustomProperties from 'packages/components/custom-properties';
import CustomSpecifications from 'packages/components/custom-specifications';
import Input from 'packages/components/input/input';

import React, { useState } from 'react'
import { set, useForm } from 'react-hook-form';

const Page = () => {

    const {
        register,
        control,
        watch,
        setValue,
        handleSubmit, formState: { errors },
    } = useForm();

    const [openImageModel, setOpenImageModel] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [images, setImages] = useState<(File | null)[]>([null]);
    const [loading, setLoading] = useState(false);


    const onSubmit = (data: any) => {
        console.log(data);
    };

    const handleImageChange = (file: File | null, index: number) => {
        const updatedImages = [...images];

        updatedImages[index] = file;
        if (index === images.length - 1 && images.length < 8) {
            updatedImages.push(null);
        }

        setImages(updatedImages);
        setValue("images", updatedImages);
    };

    const hadleRemoveImage = (index: number) => {
        setImages((prevImages) => {
            let updatedImages = [...prevImages];

            if (index === - 1) {
                updatedImages.pop();
            } else {
                updatedImages.slice(index, 1);
            }

            if (updatedImages.includes(null) && updatedImages.length < 8) {
                updatedImages.push(null);
            }

            return updatedImages;
        });

        setValue("images", images);
    };

    return (
        <form
            className='w-full mx-auto p-8 shadow-md rounded-lg text-white'
            onSubmit={handleSubmit(onSubmit)}>
            {/* Hading */}
            <h2 className='text-2xl py-2 font-semibold font-Poppins text-white'>
                Створити товар
            </h2>
            <div className='flex items-center'>
                <span className='text-[#80Deea] cursor-pointer'>Dashboard</span>
                <ChevronRight size={20} className='opacity-[.8]' />
                <span className=''>Create Product</span>
            </div>

            {/* Content layout */}
            <div className='py-4 w-full flex gap-6'>
                {/* Left side - image upload */}
                <div className='md:w-[35%]'>
                    {images?.length > 0 && (
                        <ImagePlaceholder
                            setOpnenImageModal={setOpenImageModel}
                            size='765x850'
                            small={false}
                            index={0}
                            onImageChange={handleImageChange}
                            onRemove={hadleRemoveImage}
                        />
                    )}

                    <div className='grid grid-cols-2 gap-3 mt-4'>
                        {images.slice(1).map((_, index) => (
                            <ImagePlaceholder
                                setOpnenImageModal={setOpenImageModel}
                                size='765x850'
                                key={index}
                                small={true}
                                index={index + 1}
                                onImageChange={handleImageChange}
                                onRemove={hadleRemoveImage}
                            />
                        ))}
                    </div>
                </div>

                {/* Right side - form inputs*/}
                <div className='w-[65%]'>
                    <div className='w-full flex gap-6'>
                        {/* Product tite */}
                        <div className='w-2/4'>
                            <Input
                                label='Назва товару *'
                                placeholder='Введіть назву товару'
                                {...register('title', {
                                    required: "Це поле обов'язкове",
                                })}
                            />
                            {errors.title && (
                                <p className='text-red-500 text-sm mt-1'>
                                    {errors.title.message as string}
                                </p>
                            )}

                            <div className='mt-2'>
                                <Input
                                    type='textarea'
                                    rows={7}
                                    cols={10}
                                    label='Опис товару * (Максимум 150 слів)'
                                    placeholder='Введіть опис товару'
                                    {...register('description', {
                                        required: "Це поле обов'язкове",
                                        validate: (value) => {
                                            const wordCount = value.trim().split(/\s+/).length;
                                            return (
                                                wordCount <= 150 || `Максимум 150 слів. Зараз (${wordCount} слів)`
                                            )
                                        }
                                    })}
                                />
                                {errors.description && (
                                    <p className='text-red-500 text-sm mt-1'>
                                        {errors.description.message as string}
                                    </p>
                                )}
                            </div>

                            <div className='mt-2'>
                                <Input
                                    label='Теги *'
                                    placeholder='Телефон, Ноутбук...'
                                    {...register('tags', {
                                        required: "Це поле обов'язкове, введіть через кому",
                                    })}
                                />
                                {errors.tags && (
                                    <p className='text-red-500 text-sm mt-1'>
                                        {errors.tags.message as string}
                                    </p>
                                )}
                            </div>

                            <div className='mt-2'>
                                <Input
                                    label='Гарантія *'
                                    placeholder='Рік гарантії / Немає гарантії'
                                    {...register('warranty', {
                                        required: "Це поле обов'язкове",
                                    })}
                                />
                                {errors.warranty && (
                                    <p className='text-red-500 text-sm mt-1'>
                                        {errors.warranty.message as string}
                                    </p>
                                )}
                            </div>

                            <div className='mt-2'>
                                <Input
                                    label='Slug '
                                    placeholder='slug (чатсина посилання)'
                                    {...register('slug', {
                                        required: "Це поле обов'язкове",
                                        pattern: {
                                            value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                            message: 'Тільки маленькі літери, цифри та дефіс'
                                        },
                                        minLength: {
                                            value: 3,
                                            message: 'Мінімум 3 символи'
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: 'Максимум 50 символів'
                                        }
                                    })}
                                />
                                {errors.slug && (
                                    <p className='text-red-500 text-sm mt-1'>
                                        {errors.slug.message as string}
                                    </p>
                                )}
                            </div>

                            <div className='mt-2'>
                                <Input
                                    label='Бренд *'
                                    placeholder='Введіть назву бренду'
                                    {...register('brand')}
                                />
                                {errors.brand && (
                                    <p className='text-red-500 text-sm mt-1'>
                                        {errors.brand.message as string}
                                    </p>
                                )}

                            </div>


                            <div className='mt-2'>
                                <ColorSelector control={control} errors={errors} />
                            </div>

                            <div className='mt-2'>
                                <CustomSpecifications control={control} errors={errors} />
                            </div>

                            <div className='mt-2'>
                                <CustomProperties control={control} errors={errors} />
                            </div>

                            <div className='mt-2'>
                                <label className='block font-semibold text-gray-300 mb-1'>
                                    Оплата при отриманні *
                                </label>

                                <select
                                    {...register("cash_on_delivery", {
                                        required: "Це поле обов'язкове",
                                    })}
                                    defaultValue='yes'
                                    className='w-full border outline-none border-gray-600 bg-transparent rounded-md p-2 text-gray-400'
                                >
                                    <option value="yes" className=' bg-black'>Так</option>
                                    <option value="no" className='bg-black'>Ні</option>
                                </select>
                                {errors.cash_on_delivery && (
                                    <p className='text-red-500 text-sm mt-1'>
                                        {errors.cash_on_delivery.message as string}
                                    </p>
                                )}
                            </div>



                        </div>

                        <div className='w-2/4'>
                            <label className='block font-semibold text-gray-300 mb-1'>Категорія *</label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Page