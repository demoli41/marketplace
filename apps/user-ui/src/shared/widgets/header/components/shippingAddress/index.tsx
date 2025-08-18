'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { countries } from 'apps/user-ui/src/configs/countries';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { MapPin, Plus, Trash2, X } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

const ShippingAddressSection = () => {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState:{errors}
  }=useForm({
    defaultValues:{
      label: 'Домівка',
      name: '',
      street: '',
      city: '',
      zip: '',
      country: '',
      isDefault: false,
    },
  });

  const {mutate:addAddress}=useMutation({
    mutationFn: async (payload:any) => {
      const res=await axiosInstance.post("/api/add-address",payload);
      return res.data.address;
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey: ['shipping-addresses']});
      reset();
      setShowModal(false);
    },
  });

  const {data:addresses,isLoading}=useQuery({
    queryKey:["shipping-addresses"],
    queryFn:async()=>{
      const res=await axiosInstance.get("/api/shipping-addresses");
      return res.data.addresses;
    },
  });

  const onSubmit=async (data:any)=>{
    addAddress({  ...data ,isDefault: data?.isDefault==="true" });
  }

  const {mutate:deleteAddress}=useMutation({
    mutationFn: async (id:string) => {
      await axiosInstance.delete(`/api/delete-address/${id}`);
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey: ['shipping-addresses']});
    },
  });

  return (
    <div className='space-y-4'>
      {/*Header */}
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-semibold text-gray-800'>
          Збережені адреси
        </h2>
        <button 
        onClick={() => setShowModal(true)}
        className='flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline'>
          <Plus className='h-4 w-4' />
          Додати нову адресу
        </button>
      </div>

      {/*Address List */}
      <div className='space-y-2'>
        {isLoading ? (
          <p className='text-sm text-gray-500'>Завантаження адрес...</p>
        ) : !addresses || addresses.length === 0 ? (
          <p className='text-sm text-gray-500'>Адрес не знайдено</p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {addresses.map((address:any) => (
              <div key={address.id} className='border border-gray-200 rounded-md p-4 relative'>
                {address.isDefault && (
                  <span className='absolute top-2 right-2 px-2 py-0.5 rounded-full bg-blue-100 text-xs text-blue-600'>За замовчуванням</span>
                )}
                <div className='flex items-start gap-2 text-sm text-gray-700'>
                  <MapPin className='size-5 mt-0.5 text-gray-500'/>
                  <div>
                    <p className='font-medium'>
                      {address.label} - {address.name}
                    </p>
                    <p>
                      {address.street}, {address.city}, {address.zip},{" "} 
                      {address.country}
                    </p>
                  </div>
                </div>
                <div className='flex gap-3 mt-4'>
                  <button className='flex items-center gap-1 !cursor-pointer text-xs text-red-500 hover:text-red-600 transition-colors'
                  onClick={() => deleteAddress(address.id)}
                  ><Trash2 className='size-4'/>
                  Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/*Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 '>
          <div className='bg-white w-full max-w-md p-6 rounded-md shadow-md relative'>
            <button
            className='absolute top-3 right-3 text-gray-500 hover:text-gray-800'
            onClick={() => setShowModal(false)}
            >
              <X className='h-5 w-5' />
            </button>
            <h3 className='text-lg font-semibold mb-4 text-gray-800'>Додати нову адресу</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <select {...register("label")} className="w-full p-2 border border-gray-300 rounded-md ">
                    <option value="Домівка">Домівка</option>
                    <option value="Офіс">Офіс</option>
                    <option value="Інше">Інше</option>
                </select>

                <input 
                placeholder='Ім&apos;я'
                {...register("name",{required: "Ім'я обов'язкове"})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                />
                {errors.name && <p className='text-red-500 text-xs'>{errors.name.message}</p>}

                <input 
                placeholder='Вулиця'
                {...register("street",{required: "Вулиця обов'язкова"})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                />
                {errors.street && <p className='text-red-500 text-xs'>{errors.street.message}</p>}

                <input 
                placeholder='Місто'
                {...register("city",{required: "Місто обов'язкове"})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                />
                {errors.city && <p className='text-red-500 text-xs'>{errors.city.message}</p>}

                <input 
                placeholder='ZIP код'
                {...register("zip",{required: "ZIP код обов'язковий"})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                />
                {errors.zip && <p className='text-red-500 text-xs'>{errors.zip.message}</p>}

                <select {...register("country")} className='w-full p-2 border border-gray-300 rounded-md focus:outline-none'>
                    {countries.map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>

                <select {...register("isDefault")} className='w-full p-2 border border-gray-300 rounded-md focus:outline-none'>
                    <option value="true">За замовчуванням</option>
                    <option value="false">Не за замовчуванням</option>
                </select>

                <button type='submit' className='bg-blue-600 text-white text-sm py-2 rounded-md w-full hover:bg-blue-700 transition-colors'>
                  Зберегти адресу
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShippingAddressSection