"use client";


import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type FormData = {
    email: string
    password: string
};

const ForgotPassword = () => {

    const [step, setStep] = useState<"email" | "otp" | "reset">("email");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [canResend, setCanResend] = useState(true);
    const [timer, setTimer] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

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

    const requestOtpMutation = useMutation({
        mutationFn: async ({ email }: { email: string }) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/forgot-password-user`, { email }
            );
            return response.data;
        },
        onSuccess: (_, { email }) => {
            setUserEmail(email);
            setStep("otp");
            setServerError(null);
            setCanResend(false);
            startResendTimer();
        },
        onError: (error: AxiosError) => {
            const errorMessage = (
                error.response?.data as { message?: string }
            )?.message || "Некоректний код, спробуйте ще раз";
            setServerError(errorMessage);
        },
    });

    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            if (!userEmail) return;
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-forgot-password-user`,
                { email: userEmail, otp: otp.join("") }
            );
            return response.data;
        },
        onSuccess: () => {
            setStep("reset");
            setServerError(null);
        },
        onError: (error: AxiosError) => {
            const errorMessage = (
                error.response?.data as { message?: string }
            )?.message || "Некоректний код, спробуйте ще раз";
            setServerError(errorMessage);
        },
    });

    const resetPasswordMutation = useMutation({
        mutationFn: async ({ password }: { password: string }) => {
            if (!password) return;
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reset-password-user`,
                { email: userEmail, newPassword: password }
            );
            return response.data;
        },
        onSuccess: () => {
            setStep("email");
            toast.success("Пароль успішно змінено. Тепер ви можете увійти в акаунт");
            setServerError(null);
            router.push("/login");
        },
        onError: (error: AxiosError) => {
            const errorMessage = (
                error.response?.data as { message?: string }
            )?.message || "Невдалося змінити пароль, спробуйте ще раз";
            setServerError(errorMessage);
        },
    });

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

    const onSubmitEmail = ({ email }: { email: string }) => {
        requestOtpMutation.mutate({ email });
    };

    const onSubmitPassword = ({ password }: { password: string }) => {
        resetPasswordMutation.mutate({ password });
    };


    return (
        <div className='w-full pt-20 py-10 min-h-[85vh] bg-[#f1f1f1]'>
            {/*<h1 className='text-4xl font-Poppins font-semibold text-black text-center'>
        Логін
      </h1>
      <p className='text-center text-lg font-medium text-[#00000099]'>
        Головна. Логін
      </p>*/}

            <div className='w-full flex justify-center'>
                <div className='md:w-[480px] p-8 bg-white shadow rounded-2xl'>
                    {step === "email" && (
                        <>
                            <h3 className='text-3xl font-semibold text-center mb-2'>
                                Забули пароль
                            </h3>
                            <p className='text-center text-gray-500 mb-4'>
                                Повернутись до{' '}
                                <Link href={"/login"} className='text-blue-500 font-semibold'>
                                    входу
                                </Link>
                            </p>
                            <form onSubmit={handleSubmit(onSubmitEmail)}>
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

                                <button
                                    type='submit'
                                    disabled={requestOtpMutation.isPending}
                                    className='w-full mt-4 text-lg cursor-pointer bg-black text-white py-2 rounded-lg'>
                                    {requestOtpMutation.isPending ? "Надсилаємо..." : "Надіслати код"}
                                </button>
                                {serverError && (
                                    <p className='text-red-500 text-sm mb-2'>{String(serverError)}</p>
                                )}
                            </form>
                        </>
                    )}

                    {step === "otp" && (
                        <>
                            <h3 className='text-xl font-semibold text-center mb-4'>
                                Введіть код з email
                            </h3>
                            <div className='flex justify-center gap-6'>
                                {otp.map((digit, index) => (
                                    <input 
                                    key={index}
                                    ref={(el) => {if(el) inputRefs.current[index] = el;
                                    }}
                                    type="text" 
                                    maxLength={1}
                                    className='w-12 h-12 text-center border border-gray-300 outline-none rounded-xl'
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    />
                                ))}         
                            </div>
                            <button 
                            onClick={() => verifyOtpMutation.mutate()}
                            className='w-full mt-4 text-lg cursor-pointer bg-black text-white py-2 rounded-lg'
                            disabled={verifyOtpMutation.isPending}>
                                {verifyOtpMutation.isPending ? "Перевіряємо..." : "Підтвердити"}
                            </button>

                            {canResend ? (
                                <button
                                onClick={()=>
                                    requestOtpMutation.mutate({email:userEmail!})
                                }
                                className='text-blue-500 text-center mt-4 cursor-pointer'>
                                    Надіслати код повторно
                                </button>
                            ):(
                                <p className='text-sm mt-4 text-center'>
                                    Повторна відправка коду через {timer} секунд
                                </p>
                            )}

                            {serverError && (
                                <p className='text-red-500 text-sm mb-2'>{String(serverError)}</p>
                            )}
                        </>
                    )}

                    {step === "reset" && (
                        <>
                            <h3 className='text-xl font-semibold text-center mb-4'>
                                Скинути пароль
                            </h3>

                            <form onSubmit={handleSubmit(onSubmitPassword)}>
                            <label className='block text-gray-700 mb-1'>Новий пароль</label>
                            <input 
                            type="password" 
                            placeholder='Введіть новий пароль'
                            className='w-full p-2 border border-gray-300 outline-0 mb-3'
                            {...register("password",{
                                required: "Пароль є обов'язковим",
                                minLength: {
                                    value: 6,
                                    message: "Пароль повинен містити мінімум 6 символів",
                                },
                            })}/>
                            {errors.password && (
                                <p className='text-red-500 text-sm mb-2'>{String(errors.password.message)}</p>
                            )}
                            <button 
                            type='submit'
                            disabled={resetPasswordMutation.isPending}
                            className='w-full mt-4 text-lg cursor-pointer bg-black text-white py-2 rounded-lg'>
                                {resetPasswordMutation.isPending ? "Змінюємо..." : "Змінити пароль"}
                            </button>

                            {serverError && (
                                <p className='text-red-500 text-sm mb-2'>{String(serverError)}</p>
                            )}
                            </form>
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;