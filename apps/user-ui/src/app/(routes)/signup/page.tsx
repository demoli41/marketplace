"use client";

import { useMutation } from '@tanstack/react-query';
import GoogleButton from 'apps/user-ui/src/shared/widgets/header/components/google-button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';

type FormData = {
  name: string
  email: string
  password: string
};

const Signup = () => {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev)=>{
        if(prev <= 1){
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const signupMutation=useMutation({
    mutationFn:async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-registration`
        , data);
      return response.data;
    },
    onSuccess: (_,formData)=>{
      setUserData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();

    },
  });

  const verifyOtpMutation=useMutation({
    mutationFn:async()=>{
      if(!userData) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-user`
        , {
          ...userData,
          otp: otp.join(""),
        }
      );
      return response.data;
    },
    onSuccess:()=>{
      router.push("/login");
    },
  });

  const onSubmit = (data: FormData) => {
    signupMutation.mutate(data);
  };

  const handleOtpChange = (index: number, value: string) => {
    if(!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if(value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resendOtp = () => {
    if(userData){
      signupMutation.mutate(userData);
    }
  };

  return (
    <div className='w-full pt-20 py-10 min-h-[85vh] bg-[#f1f1f1]'>
      {/*<h1 className='text-4xl font-Poppins font-semibold text-black text-center'>
        Реєстрація
      </h1>
      <p className='text-center text-lg font-medium text-[#00000099]'>
        Головна. Логін
      </p>*/}

      <div className='w-full flex justify-center'>
        <div className='md:w-[480px] p-8 bg-white shadow rounded-2xl'>
          <h3 className='text-3xl font-semibold text-center mb-2'>
            Реєстрація до маркетплейсу
          </h3>
          <p className='text-center text-gray-500 mb-4'>
            Вже є акаунт?{' '}
            <Link href={"/login"} className='text-blue-500 font-semibold'>
              Увійти
            </Link>
          </p>

          <GoogleButton />
          <div className='flex items-center my-5 text-gray-400 text-sm' >
            <div className='flex-1 border-t border-gray-300' />
            <span className='px-3'>
              {
                !showOtp ? (
                  "або через email"
                ):(
                  "код надіслано на пошту"
                ) 
              }
            </span>
            <div className='flex-1 border-t border-gray-300' />
          </div>


          {!showOtp ? (<form onSubmit={handleSubmit(onSubmit)}>

            <label className='block text-gray-700 mb-1'>Ім'я</label>
            <input type="text"
              placeholder="Ім`я"
              className='w-full border border-gray-300 !rounded p-2 outline-0 mb-1'
              {...register("name", {
                required: "Ім'я є обов'язковим",
              })}
            />
            {errors.name && (
              <p className='text-red-500 text-sm mb-2'>{String(errors.name.message)}</p>
            )}

            <label className='block text-gray-700 mb-1'>Email</label>
            <input type="email"
              placeholder='example@mail.com'
              className='w-full border border-gray-300 !rounded p-2 outline-0 mb-1'
              {...register("email", {
                required: "Emil є обов'язковим",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Некоректний формат email",
                }
              })}
            />
            {errors.email && (
              <p className='text-red-500 text-sm mb-2'>{String(errors.email.message)}</p>
            )}

            <label className='block text-gray-700 mb-1'>Пароль</label>
            <div className='relative'>
              <input type={passwordVisible ? "text" : "password"}
                placeholder='мінімум 6 символів'
                className='w-full border border-gray-300 !rounded p-2 outline-0 mb-1'
                {...register("password", {
                  required: "Пароль є обов'язковим",
                  minLength: {
                    value: 6,
                    message: "Пароль повинен містити мінімум 6 символів",
                  }
                })}
              />
              <button type='button' onClick={() => setPasswordVisible(!passwordVisible)} className='absolute inset-y-0 right-3 flex items-center text-gray-400'>
                {passwordVisible ? <Eye /> : <EyeOff />}
              </button>
              {errors.password && (
                <p className='text-red-500 text-sm mb-2'>{String(errors.password.message)}</p>
              )}

            </div>


            <button
              type='submit'
              disabled={signupMutation.isPending}
              className='w-full text-lg mt-4 cursor-pointer bg-black text-white py-2 rounded-lg'>
              {signupMutation.isPending ? "Реєстрація...":"Зареєструватися"}
            </button>
          </form>) : (
            <div>
              <h3 className='text-xl font-semibold text-center mb-4'>Введіть OTP-код для підтвердження</h3>
              <div className='flex justify-center gap-6'>
                {otp?.map((digit,index)=>(
                  <input type="text" key={index}  ref={(el)=>{
                    if(el){
                      inputRefs.current[index] = el;
                    }
                  }
                 }
                 maxLength={1}
                 className='w-12 h-12 text-center border border-gray-300 outline-none rounded-xl'
                  value={digit}
                  onChange={(e)=>handleOtpChange(index,e.target.value)}
                  onKeyDown={(e)=>handleOtpKeyDown(index,e)}
                 />
                ))}
              </div>
              <button 
              className='w-full mt-4 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg'
              disabled={verifyOtpMutation.isPending}
              onClick={()=>verifyOtpMutation.mutate()}
              >
                {verifyOtpMutation.isPending ? "Перевірка...":"Підтвердити код"}
              </button>
              <p className='text-sm mt-4 text-center'>
                {canResend ? (
                  <button 
                  onClick={resendOtp}
                  className='text-blue-500 cursor-pointer'
                  >
                    Надіслати код повторно
                    </button>
                ):(
                  `Повторна відправка коду через ${timer} секунд`
                )}
              </p>
              {
                verifyOtpMutation?.isError && 
                verifyOtpMutation.error instanceof AxiosError && (
                  <p className='text-red-500 text-sm mt-2'>
                    {verifyOtpMutation.error?.response?.data?.message || "Помилка при перевірці коду"}
                  </p>
                )
              }

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Signup;