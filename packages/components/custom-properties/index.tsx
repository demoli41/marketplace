import React, { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Plus, X } from 'lucide-react';
import Input from '../input/input';

const CustomProperties = ({ control, errors }: any) => {

    const [properties, setProperties] = useState<{ label: string, values: string[] }[]>([]);
    const [newLabel, setNewLabel] = useState('');
    const [newValue, setNewValue] = useState('');

    return (
        <div>
            <div className='flex flex-col gap-3'>
                <Controller
                    name={`customProperties`}
                    control={control}
                    render={({ field }) => {
                        useEffect(() => {
                            field.onChange(properties);
                        }, [properties]);

                        const addProperty = () => {
                            if (!newLabel.trim()) return;
                            setProperties([...properties, { label: newLabel, values: [] }]);
                            setNewLabel('');
                        };

                        const addValue = (index: number) => {
                            if (!newValue.trim()) return;
                            const updatedProperties = [...properties];
                            updatedProperties[index].values.push(newValue);
                            setProperties(updatedProperties);
                            setNewValue('');
                        };

                        const removeProperty = (index: number) => {
                            setProperties(properties.filter((_, i) => i !== index));
                        };

                        return (
                            <div className='mt-2'>
                                <label className='block font-semibold text-gray-300 mb-1'>Кастомні властивості</label>

                                <div className='flex flex-col gap-3'>
                                    {/*Existing properties*/}
                                    {properties.map((property, index) => (
                                        <div key={index} className='border border-gray-700 p-3 rounded-lg bg-gray-900'>
                                            <div className='flex items-center justify-between'>
                                                <span className='text-white font-medium'>
                                                    {property.label}
                                                </span>
                                                <button
                                                    type='button'
                                                    onClick={() => removeProperty(index)}
                                                ><X size={18} className='text-red-500' /></button>
                                            </div>

                                            {/*Add Values to property*/}
                                            <div className='flex items-center gap-2 mt-2'>
                                                <Input
                                                    type='text'
                                                    className='border outline-none border-gray-700 bg-gray-800 rounded-md p-2 text-white w-full'
                                                    placeholder='Додати значення'
                                                    value={newValue}
                                                    onChange={(e: any) => setNewValue(e.target.value)}
                                                />
                                                <button
                                                    type='button'
                                                    onClick={() => addValue(index)}
                                                    className='text-blue-500 hover:bg-blue-600'
                                                >
                                                    Додати
                                                </button>
                                            </div>

                                            {/*Show values of property*/}
                                            <div className='flex flex-wrap gap-2 mt-2'>
                                                {property.values.map((value, i) => (
                                                    <span key={i} className='px-2 py-1 bg-gray-700 text-white rounded-md'>
                                                        {value}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/*Add new property*/}
                                    <div className='flex items-center gap-2 mt-1'>
                                        <Input
                                            placeholder='Назва властивості (Матеріал, Розмір)'
                                            value={newLabel}
                                            onChange={(e: any) => setNewLabel(e.target.value)}
                                        />
                                        <button
                                            type='button'
                                            onClick={addProperty}
                                            className='px-3 py-2 bg-blue-500 text-white rounded-md flex items-center'>
                                            <Plus size={16} />Додати
                                        </button>
                                    </div>
                                </div>
                                {errors.customProperties && (
                                    <p className='text-red-500 text-sm mt-1'>
                                        {errors.customProperties.message as string}
                                    </p>
                                )}
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    )
}

export default CustomProperties;