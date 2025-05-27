'use client';
import { useQuery } from '@tanstack/react-query';
import ImagePlaceholder from 'apps/seller-ui/src/shared/components/image-placeholder';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';


import { ChevronRight } from 'lucide-react';
import ColorSelector from 'packages/components/color-selector';
import CustomProperties from 'packages/components/custom-properties';
import CustomSpecifications from 'packages/components/custom-specifications';
import Input from 'packages/components/input/input';
import RichTextEditor from 'packages/components/rich-text-editor/rich-text-editor';
import SizeSelector from 'packages/components/size-selector/size-selector';

import React, { useMemo, useState } from 'react'
import { Controller, set, useForm } from 'react-hook-form';

const Page = () => {

    const {
        register,
        control,
        watch,
        setValue,
        handleSubmit, formState: { errors },
    } = useForm();

    const [openImageModel, setOpenImageModel] = useState(false);
    const [isChanged, setIsChanged] = useState(true);
    const [images, setImages] = useState<(File | null)[]>([null]);
    const [loading, setLoading] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/product/api/get-categories");
                return res.data;
            } catch (error) {
                console.log(error);
            }
        },
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });

    const { data: discountCodes = [], isLoading: discountLoading } = useQuery({
        queryKey: ["shop-discounts"],
        queryFn: async () => {
            const res = await axiosInstance.get('/product/api/get-discount-codes');
            return res?.data?.discount_codes || [];
        },
    });

    const categories = data?.categories || [];
    const subCategoriesData = data?.subCategories || [];

    const selectedCategory = watch("category");
    const regularPrice = watch("regular_price");

    const subcategories = useMemo(() => {
        return selectedCategory ? subCategoriesData[selectedCategory] || [] : [];
    }, [selectedCategory, subCategoriesData]);

    console.log(categories, subCategoriesData);


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

    const handleSaveDraft = () => {

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
                                    label='Короткий опис товару * (Максимум 150 слів)'
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
                            {
                                isLoading ? (
                                    <p className='text-gray-400'>Завантаження категорій...</p>
                                ) : isError ? (
                                    <p className='text-red-500 '>
                                        Помилка завантаження категорій
                                    </p>
                                ) : (
                                    <Controller
                                        name='category'
                                        control={control}
                                        rules={{ required: "Категорія обов'язкова" }}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                className='w-full border outline-none border-gray-700 bg-transparent rounded-md p-2 text-gray-400'
                                            >
                                                <option value="" className='bg-black'>Виберіть категорію</option>
                                                {categories?.map((category: string) => (
                                                    <option
                                                        key={category}
                                                        value={category}
                                                        className='bg-black'
                                                    >
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    />
                                )
                            }
                            {errors.category && (
                                <p className='text-red-500 text-sm mt-1'>
                                    {errors.category.message as string}
                                </p>
                            )}

                            <div className='mt-2'>
                                <label className='block font-semibold text-gray-300 mb-1'>Підкатегорія *</label>

                                <Controller
                                    name='subcategory'
                                    control={control}
                                    rules={{ required: "Підкатегорія обов'язкова" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className='w-full border outline-none border-gray-700 bg-transparent rounded-md p-2 text-gray-400'
                                        >
                                            <option value="" className='bg-black'>Виберіть підкатегорію</option>
                                            {subcategories?.map((subcategory: string) => (
                                                <option
                                                    key={subcategory}
                                                    value={subcategory}
                                                    className='bg-black'
                                                >
                                                    {subcategory}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />

                                {errors.subcategory && (
                                    <p className='text-red-500 text-sm mt-1'>
                                        {errors.subcategory.message as string}
                                    </p>
                                )}
                            </div>

                            <div className='mt-2'>
                                <label className='block font-semibold text-gray-300 mb-1'>Опис деталей (мінімум 100 слів)*</label>

                                <Controller
                                    name='detailed_description'
                                    control={control}
                                    rules={{
                                        required: "Це поле обов'язкове",
                                        validate: (value) => {
                                            const wordCount = value
                                                ?.split(/\s+/)
                                                .filter((word: string) => word).length;
                                            return (
                                                wordCount >= 100 || `Мінімум 100 слів. Зараз (${wordCount} слів)`
                                            );
                                        },
                                    }}

                                    render={({ field }) => (
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                {errors.detailed_description && (
                                    <p className='text-red-500 text-sm mt-1'>
                                        {errors.detailed_description.message as string}
                                    </p>
                                )}
                            </div>

                            <div className='mt-2'>
                                <Input
                                    label='Посилання на відеоогляд'
                                    placeholder='https://www.youtube.com/watch?v=example'
                                    {...register('video_url', {
                                        pattern: {
                                            value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
                                            message: 'Неправильне посилання на YouTube'
                                        },
                                    })}
                                />
                                {errors.video_url && (
                                    <p className='text-red-500 text-sm mt-1'>
                                        {errors.video_url.message as string}
                                    </p>
                                )}
                            </div>

                            <div className='mt-2'>
                                <Input
                                    label='Регулярна ціна *'
                                    placeholder='20$'
                                    {...register('regular_price', {
                                        required: "Це поле обов'язкове",
                                        valueAsNumber: true,
                                        min: { value: 1, message: "Ціна повинна бути більше 1" },
                                        validate: (value) => isNaN(value) || value > 0 || "Ціна повинна бути більше 0",
                                    })}
                                />
                                {errors.regular_price && (
                                    <p className='text-red-500 text-sm mt-1'>
                                        {errors.regular_price.message as string}
                                    </p>
                                )}
                            </div>

                            <div className='mt-2'>
                                <Input
                                    label='Ціна розпродажу *'
                                    placeholder='20$'
                                    {...register('sale_price', {
                                        required: "Це поле обов'язкове",
                                        valueAsNumber: true,
                                        min: { value: 1, message: "Ціна повинна бути більше 1" },
                                        validate: (value) => {
                                            if (isNaN(value)) return "Ціна повинна бути числом";
                                            if (regularPrice && value >= regularPrice) {
                                                return "Ціна розпродажу повинна бути менше регулярної ціни";
                                            }
                                            return true;
                                        },
                                    })}
                                />
                                {errors.sale_price && (
                                    <p className='text-red-500 text-sm mt-1'>
                                        {errors.sale_price.message as string}
                                    </p>
                                )}
                            </div>

                            <div className='mt-2'>
                                <Input
                                    label='Кількість на складі *'
                                    placeholder='100'
                                    {...register('stock', {
                                        required: "Це поле обов'язкове",
                                        valueAsNumber: true,
                                        min: { value: 1, message: "Кількість повинна бути не менше 1" },
                                        max: { value: 1000, message: "Максимальна кількість 1000" },
                                        validate: (value) => {
                                            if (isNaN(value)) return "Кількість повинна бути числом";
                                            if (!Number.isInteger(value)) return "Кількість повинна бути цілим числом";
                                            return true;
                                        },
                                    })}
                                />
                                {errors.stock && (
                                    <p className='text-red-500 text-sm mt-1'>
                                        {errors.stock.message as string}
                                    </p>
                                )}
                            </div>

                            <div className='mt-2'>
                                <SizeSelector control={control} errors={errors} />
                            </div>

                            <div className='mt-3'>
                                <label className='block font-semibold text-gray-300 mb-1'>Оберіть код на знижку</label>


                                {discountLoading ? (
                                    <p className='text-gray-400'>
                                        Завантаження кодів на знижку...
                                    </p>
                                ) : (
                                    <div className='flex flex-wrap gap-2'>
                                        {discountCodes?.map((code: any) => (
                                            <button key={code.id}
                                                type='button'
                                                className={`px-3 py-1 rounded-md text-sm font-semibold border ${watch("discountCodes")?.includes(code.id) ? "bg-blue-600 text-white border-blue-600 " : "bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-700"}`}
                                                onClick={() => {
                                                    const currentSelection = watch("discountCodes") || [];
                                                    const updatedSelection = currentSelection?.includes(code.id) ? currentSelection.filter((id: string) => id !== code.id) : [...currentSelection, code.id];
                                                    setValue("discountCodes", updatedSelection);
                                                }}
                                            >
                                                {code.public_name} ({code.discountValue})
                                                {code.discountType === "percentage" ? "%" : "$"}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-6 flex justify-end gap-3'>
                {
                    isChanged && (
                        <button
                            onClick={handleSaveDraft}
                            type='button'
                            className='px-4 py-2 bg-gray-700 text-white rounded-md'>
                            Зберегти як чернетку
                        </button>
                    )
                }
                <button
                    type='submit'
                    className='px-4 py-2 bg-blue-700 text-white rounded-md'
                    disabled={loading}
                >
                    {loading ? "Завантаження..." : "Опублікувати товар"}
                </button>
            </div>
        </form>
    )
}

export default Page