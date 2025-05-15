"use client";

import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import React, { useRef } from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { countries } from 'apps/seller-ui/src/utils/countries';
import CreateShop from 'apps/seller-ui/src/shared/modules/auth/create-shop';


const Signup = () => {

  const [activeStep, setActiveStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [sellerData, setSellerData] = useState<FormData | null>(null);
  const [sellerId, setSellerId] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/seller-registration`
        , data);
      return response.data;
    },
    onSuccess: (_, formData) => {
      setSellerData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();

    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!sellerData) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-seller`
        , {
          ...sellerData,
          otp: otp.join(""),
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setSellerId(data?.seller?.id);
      setActiveStep(2);
    },
  });

  const onSubmit = (data: any) => {
    signupMutation.mutate(data);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resendOtp = () => {
    if (sellerData) {
      signupMutation.mutate(sellerData);
    }
  };

  const connectStripe =async () => {
    try {
      const response=await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-stripe-link`,{sellerId});

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error connecting to Stripe:", error);
    }
  };


  return (
    <div className="w-full flex flex-col items-center pt-10 min-h-screen">
      {/*stepper*/}
      <div className='relative flex items-center justify-between md:w-[50%] mb-8'>
        <div className='absolute top-[25%] left-0 w-[80%] md:w-[90%] h-1 bg-gray-300 -z-10' />
        {[1, 2, 3].map((step) => (
          <div key={step}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${step <= activeStep ? "bg-blue-600" : "bg-gray-300"}`}>
              {step}
            </div>
            <span className='ml-[-15px]'>
              {step === 1 ? "Create Account" : step === 2 ? "Setup Shop" : "Connect Bank"}
            </span>
          </div>
        ))}
      </div>

      {/*stepper content*/}
      <div className='md:w-[480px] w-[80%] p-8 bg-white shadow rounded-lg'>
        {activeStep === 1 && (
          <>
            {!showOtp ? (<form onSubmit={handleSubmit(onSubmit)}>
              <h3 className='text-xl font-semibold text-center mb-4'>Створити акаунт</h3>
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

              <label className='block text-gray-700 mb-1'>Телефон</label>
              <input
                type="tel"
                placeholder='+380*******'
                className='w-full border border-gray-300 !rounded p-2 outline-0 mb-1'
                {...register("phone_number", {
                  required: "Телефон є обов'язковим",
                  pattern: {
                    value: /^\+380\d{9}$/,
                    message: "Некоректний формат телефону",
                  },
                  minLength: {
                    value: 9,
                    message: "Телефон повинен містити мінімум 9 символів",
                  },
                  maxLength: {
                    value: 13,
                    message: "Телефон повинен містити максимум 13 символів",
                  }
                })}
              />

              {errors.phone_number && (
                <p className='text-red-500 text-sm'>{String(errors.phone_number.message)}</p>
              )}

              <label className='block text-gray-700 mb-1'>Країна</label>
              <select
                className='w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1'
                {...register("country", {
                  required: "Країна є обов'язковою"
                })}>
                <option value="">Виберіть свою країну</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>{country.name}
                  </option>
                ))}
              </select>

              {errors.country && (
                <p className='text-red-500 text-sm mb-2'>{String(errors.country.message)}</p>
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
                {signupMutation.isPending ? "Реєстрація..." : "Зареєструватися"}
              </button>

              {signupMutation.isError &&
                signupMutation.error instanceof AxiosError && (
                  <p className='text-red-500 text-sm mt-2'>
                    {signupMutation.error?.response?.data?.message || signupMutation.error.message}
                  </p>
                )}

              <p className='pt-3 text-center'>
                Вже маєте акаунт?{" "}
                <Link href={"/login"} className='text-blue-500'>Увійти</Link>
              </p>

            </form>) : (
              <div>
                <h3 className='text-xl font-semibold text-center mb-4'>Введіть OTP-код для підтвердження</h3>
                <div className='flex justify-center gap-6'>
                  {otp?.map((digit, index) => (
                    <input type="text" key={index} ref={(el) => {
                      if (el) {
                        inputRefs.current[index] = el;
                      }
                    }
                    }
                      maxLength={1}
                      className='w-12 h-12 text-center border border-gray-300 outline-none rounded-xl'
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>
                <button
                  className='w-full mt-4 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg'
                  disabled={verifyOtpMutation.isPending}
                  onClick={() => verifyOtpMutation.mutate()}
                >
                  {verifyOtpMutation.isPending ? "Перевірка..." : "Підтвердити код"}
                </button>
                <p className='text-sm mt-4 text-center'>
                  {canResend ? (
                    <button
                      onClick={resendOtp}
                      className='text-blue-500 cursor-pointer'
                    >
                      Надіслати код повторно
                    </button>
                  ) : (
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
          </>
        )}
        {activeStep === 2 && (
          <CreateShop sellerId={sellerId} setActiveStep={setActiveStep}/>
        )}
        {activeStep===3&&(
          <div className='text-center'>
            <h3 className='text-2xl font-semibold'>Метод виведення коштів</h3>
            <br />
            <button 
            onClick={connectStripe}
            className='w-full m-auto flex items-center justify-center gap-3 text-lg bg-[#334155] text-white py-2 rounded-lg'>
              Підключити Stripe
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;