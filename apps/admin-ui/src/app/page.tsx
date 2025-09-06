'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Input from 'packages/components/input/input';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';


type FormData={
  email:string,
  password:string
}

const Page = () => {
  const {register,handleSubmit}=useForm<FormData>();
  const [serverError,setServerError]=useState<string|null>(null);
  const router=useRouter();

  const loginMutation=useMutation({
    mutationFn:async(data:FormData)=>{
      const response=await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/login-admin`,
        data,
        {withCredentials:true}       
      );
      return response.data;
    },
    onSuccess(data) {
      setServerError(null);  
      router.push('/dashboard');
    },
    onError(error:AxiosError) {
      const errorMessage=
      (error.response?.data as {message:string})?.message ||
      "An error occurred. Please try again.";
      setServerError(errorMessage);
    }
  })

  const onSubmit=async(data:FormData)=>{
    loginMutation.mutate(data);
  }

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='md:w-[450px] pb-8 bg-slate-800 rounded-md shadow'>
        <form className='p-5 ' onSubmit={handleSubmit(onSubmit)}>
          <h1 className='text-3xl pb-3 pt-4 font-semibold text-center text-white font-Poppins'>Admin UI</h1>

          <Input
          label='Email'
          placeholder='Введіть email'
          {...register('email',{required:'Email is required',
          pattern:{
            value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message:'Некоректний email'
          }
          })}
          />

          <div className='mt-3'>
            <Input
          label='Password'
          placeholder='Введіть пароль'
          type='password'
          {...register('password',{required:'Password is required',
          minLength:{
            value:6,
            message:'Пароль повинен містити щонайменше 6 символів'
          }
          })}
          />
          </div>

          <button
          disabled={loginMutation.isPending}
          type='submit' className='w-full mt-5 flex justify-center font-semibold font-Poppins cursor-pointer bg-blue-600 py-2 rounded-lg text-white'>
            {loginMutation.isPending ? <div className='size-6 border-2 border-gray-100 border-t-transparent rounded-full animate-spin'>

            </div> : 'Login'}
          </button>

          {serverError && (
            <p className='text-red-500 text-sm mt-2 text-center'>{serverError}</p>
          )}
        </form>
      </div>
    </div>
  )
}

export default Page

