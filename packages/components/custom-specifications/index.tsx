import React from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import Input from '../input/input';
import { PlusCircle, Trash2 } from 'lucide-react';

const CustomSpecifications = ({ control, errors }: any) => {

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'custom_specifications'
    });

    return (
        <div>
            <label className='block font-semibold text-gray-330 mb-1'>
                Специфікації
            </label>
            <div className='flex flex-col gap-3'>
                {fields?.map((item, index) => (
                    <div key={index} className='flex gap-2 items-center' >
                        <Controller
                            name={`custom_specifications.${index}.name`}
                            control={control}
                            rules={{ required: "Це поле обов'язкове" }}
                            render={({ field }) => (
                                <Input
                                    label='Назва специфікації'
                                    placeholder='Матеріал, Розмір, Вага'
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name={`custom_specifications.${index}.value`}
                            control={control}
                            rules={{ required: "Це поле обов'язкове" }}
                            render={({ field }) => (
                                <Input
                                    label='Значення'
                                    placeholder='100% бавовна, 42, 1.5 кг'
                                    {...field}
                                />
                            )}
                        />
                        <button
                            type='button'
                            onClick={() => remove(index)}
                            className='text-red-500 hover:bg-red-700 items-center'
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}

                <button
                    type='button'
                    onClick={() => append({ name: '', value: '' })}
                    className='flex items-center gap-2 text-blue-500 hover:bg-blue-600'
                    >
                        <PlusCircle size={20} />Додати специфікацію
                    </button>
            </div>
            {errors?.custom_specifications && (
                <p className='text-red-500 text-sm mt-1'>
                    {errors.custom_specifications.message as string}
                </p>
            )}
        </div>
    )
}

export default CustomSpecifications