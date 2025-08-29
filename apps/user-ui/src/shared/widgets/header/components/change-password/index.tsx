'use client';

import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const ChangePassword = () => {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors,isSubmitting },
    } = useForm()

    const onSubmit=async (data:any)=>{
        setError("");
        setMessage("");
        try {
            await axiosInstance.post("api/change-password", {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data?.confirmPassword
            });
            setMessage("Пароль успішно змінено");
            reset();
        } catch (error) {
            setError("Сталася помилка при зміні пароля");
        }
    };

  return (
    <div className='max-w-md mx-auto space-y-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div >
                <label className='block mb-1 text-xs font-medium text-gray-700'>
                    Поточний пароль
                </label>
                <input
                    type="password"
                    placeholder='Введіть поточний пароль'
                    {...register("currentPassword", { required: "Це поле обов'язкове" })}
                    className={`mt-1 block w-full border rounded-md p-2 ${
                        errors.currentPassword ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.currentPassword?.message && (
                    <p className="mt-1 text-xs text-red-500">{String(errors.currentPassword.message)}</p>
                )}
            </div>

            <div >
                <label className='block mb-1 text-xs font-medium text-gray-700'>
                    Новий пароль
                </label>
                <input
                    type="password"
                    placeholder='Введіть новий пароль'
                    {...register("newPassword", { 
                        required: "Це поле обов'язкове", 
                        minLength:{
                            value: 8,
                            message: "Пароль повинен містити щонайменше 8 символів"
                        },
                        validate:{
                            hasLower:(value)=>
                                /[a-z]/.test(value) || "Пароль повинен містити принаймні одну малу літеру",
                            hasUpper:(value)=>
                                /[A-Z]/.test(value) || "Пароль повинен містити принаймні одну велику літеру",
                            hasNumber:(value)=>
                                /\d]/.test(value) || "Пароль повинен містити принаймні одну цифру",
                            hasSpecial:(value)=>
                                /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Пароль повинен містити принаймні один спеціальний символ"
                        }
                    })}
                    className={`mt-1 block w-full border rounded-md p-2 ${
                        errors.newPassword ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.newPassword?.message && (
                    <p className="mt-1 text-xs text-red-500">{String(errors.newPassword.message)}</p>
                )}
            </div>

            <div >
                <label className='block mb-1 text-xs font-medium text-gray-700'>
                    Підтвердіть новий пароль
                </label>
                <input
                    type="password"
                    placeholder='Підтвердіть новий пароль'
                    {...register("confirmPassword", { 
                        required: "Це поле обов'язкове", 
                        validate:(value)=>
                            value === watch("newPassword") || "Паролі не співпадають"
                    })}
                    className={`mt-1 block w-full border rounded-md p-2 ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.confirmPassword?.message && (
                    <p className="mt-1 text-xs text-red-500">{String(errors.confirmPassword.message)}</p>
                )}
            </div>

            <button 
            disabled={isSubmitting}
            type="submit" 
            className='w-full mt-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md'>
                Змінити пароль
            </button>
        </form>

        {error && <p className='text-sm text-center text-red-500'>{error}</p>}
        {message && (
            <p className='text-green-500 text-center text-sm'>{message}</p>
        )}
    </div>
  )
}

export default ChangePassword