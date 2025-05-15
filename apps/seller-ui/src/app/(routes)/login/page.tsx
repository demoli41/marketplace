"use client";

import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useState } from 'react';
import { set, useForm } from 'react-hook-form';

type FormData={
  email:string
  password:string
};

const Login=()=> {

  const [passwordVisible,setPasswordVisible]=useState(false);
  const [serverError,setServerError]=useState<string|null>(null);
  const [rememberMe,setRememberMe]=useState(false);
  const router=useRouter();

  const {
    register,
    handleSubmit,
    formState:{errors},
  }=useForm<FormData>();

  const loginMutation=useMutation({
    mutationFn: async (data:FormData)=>{
      const response=await axios.post( `${process.env.NEXT_PUBLIC_SERVER_URL}/api/login-seller`,data,
        {
          withCredentials:true
        }
      );
      return response.data;
    },
    onSuccess:(data)=>{
    setServerError(null);
    router.push("/");
    },
    onError:(error:AxiosError)=>{
      const errorMessage=(error.response?.data as {message?:string})?.message || "Невірні дані для входу";
      setServerError(errorMessage);
    },
  })

  const onSubmit=(data:FormData)=>{
    loginMutation.mutate(data);
  };

  return (
    <div className='w-full pt-20 py-10 min-h-screen bg-[#f1f1f1]'>
      {/*<h1 className='text-4xl font-Poppins font-semibold text-black text-center'>
        Логін
      </h1>
      <p className='text-center text-lg font-medium text-[#00000099]'>
        Головна. Логін
      </p>*/}

      <div className='w-full flex justify-center'>
        <div className='md:w-[480px] p-8 bg-white shadow rounded-2xl'>
          <h3 className='text-3xl font-semibold text-center mb-2'>
            Вхід до маркетплейсу
          </h3>
          <p className='text-center text-gray-500 mb-4'>
            Немає акаунту?{' '}
            <Link href={"/signup"} className='text-blue-500 font-semibold'>
              Зареєструватися
            </Link>
          </p>

          <div className='flex items-center my-5 text-gray-400 text-sm' >
            <div className='flex-1 border-t border-gray-300'/>
            <span className='px-3'>
              через email
            </span>
            <div className='flex-1 border-t border-gray-300'/>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className='block text-gray-700 mb-1'>Email</label>
            <input type="email"
            placeholder='example@mail.com'
            className='w-full border border-gray-300 !rounded p-2 outline-0 mb-1'
            {...register("email",{
              required:"Emil є обов'язковим",
              pattern:{
                value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message:"Некоректний формат email",
              }
            })}
            />
            {errors.email && (
              <p className='text-red-500 text-sm mb-2'>{String(errors.email.message)}</p>
            )}

          <label className='block text-gray-700 mb-1'>Пароль</label>
          <div className='relative'>
          <input type={passwordVisible?"text":"password"}
            placeholder='мінімум 6 символів'
            className='w-full border border-gray-300 !rounded p-2 outline-0 mb-1'
            {...register("password",{
              required:"Пароль є обов'язковим",
              minLength:{
                value:6,
                message:"Пароль повинен містити мінімум 6 символів",
              }
            })}
            />
            <button type='button' onClick={()=>setPasswordVisible(!passwordVisible)} className='absolute inset-y-0 right-3 flex items-center text-gray-400'>
              {passwordVisible? <Eye/>: <EyeOff/>}
            </button>
            {errors.password && (
              <p className='text-red-500 text-sm mb-2'>{String(errors.password.message)}</p>
            )}

          </div>
          <div className='flex items-center justify-between my-4'>
              <label className='block text-gray-700 mb-1'>
                <input 
                type="checkbox" 
                className='mr-2' 
                checked={rememberMe} 
                onChange={()=>setRememberMe(!rememberMe)}/>
                Запаматати мене
              </label>
              <Link href={"/forgot-password"} className='text-blue-500 text-sm'>
                Забули пароль?
              </Link>
            </div>

            <button 
            type='submit' 
            disabled={loginMutation.isPending}
            className='w-full text-lg cursor-pointer bg-black text-white py-2 rounded-lg'>
              {
                loginMutation.isPending?"Вхід...":"Увійти"
              }
            </button>
            {serverError && (
              <p className='text-red-500 text-sm mb-2'>{String(serverError)}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;