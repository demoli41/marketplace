'use client';
import { useQueryClient } from '@tanstack/react-query';
import useUser from 'apps/user-ui/src/hooks/useUser';
import QuickActionCard from 'apps/user-ui/src/shared/widgets/header/components/cards/quick-action.card';
import StatCard from 'apps/user-ui/src/shared/widgets/header/components/cards/stat.card';
import ShippingAddressSection from 'apps/user-ui/src/shared/widgets/header/components/shippingAddress';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { BadgeCheck, Bell, CheckCircle, Clock, Gift, Inbox, Loader2, Lock, LogOut, MapPin, Pencil, PhoneCall, Receipt, Settings, ShoppingBag, Truck, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const searchParams=useSearchParams();
    const router=useRouter();
    const queryClient=useQueryClient();

    const { user,isLoading } = useUser();
    const queryTab=searchParams.get("active") || "Профіль";
    const [activeTab, setActiveTab] = useState(queryTab);

    useEffect(()=>{
        if(activeTab !== queryTab) {
            const newParams=new URLSearchParams(searchParams);
            newParams.set("active", activeTab);
            router.replace(`/profile?${newParams.toString()}`);
        }
    },[activeTab])

    const logOutHandler = async () => {
        await axiosInstance.get("/api/logout-user").then((res)=>{
            queryClient.invalidateQueries({queryKey: ['user']});

            router.push("/login");
        });
    };

  return (
    <div className='bg-gray-50 p-6 pb-14'>
        <div className='md:max-w-8xl mx-auto'>
            {/*Greeting */}
            <div className='text-center mb-10'>
                <h1 className='text-3xl font-bold text-gray-800'>Вітаємо, {" "}
                <span className='text-blue-600'>
                    {isLoading ? (
                        <Loader2 className='inline animate-spin size-5' />
                    ):(
                        `${user?.name}`
                    )}
                </span>{" "}
                </h1>
            </div>

            {/*Profile overview */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                <StatCard title="Всього замовлень" count={10} Icon={Clock} />
                <StatCard title="Замовлень в процесі" count={4} Icon={Truck} />
                <StatCard title="Виконані замовлення" count={5} Icon={CheckCircle} />
            </div>

            {/*Sidebar and content layout */}
            <div className='mt-10 flex flex-col md:flex-row gap-6'>
                {/*Left Navigation */}
                <div className='bg-white p-4 rounded-md shadow-sm border border-gray-100 w-full md:w-1/5'>
                    <nav className='space-y-2'>
                        <NavItem 
                        label="Профіль" 
                        Icon={User} 
                        active={activeTab==="Профіль"} 
                        onClick={() => setActiveTab("Профіль")} />
                        <NavItem 
                        label="Мої замовлення" 
                        Icon={ShoppingBag} 
                        active={activeTab==="Мої замовлення"} 
                        onClick={() => setActiveTab("Мої замовлення")} />
                        <NavItem 
                        label="Вхідні" 
                        Icon={Inbox} 
                        active={activeTab==="Вхідні"} 
                        onClick={() => router.push("/inbox")} />
                        <NavItem 
                        label="Сповіщення" 
                        Icon={Bell} 
                        active={activeTab==="Сповіщення"} 
                        onClick={() => setActiveTab("Сповіщення")} />
                        <NavItem 
                        label="Адреса доставки" 
                        Icon={MapPin} 
                        active={activeTab==="Адреса доставки"} 
                        onClick={() => setActiveTab("Адреса доставки")} />
                        <NavItem 
                        label="Змінити пароль" 
                        Icon={Lock} 
                        active={activeTab==="Змінити пароль"} 
                        onClick={() => setActiveTab("Змінити пароль")} />
                        <NavItem 
                        label="Вийти" 
                        Icon={LogOut} 
                        danger 
                        onClick={()=>logOutHandler()} />
                    </nav>
                </div>

                {/*Main content */}
                <div className='bg-white p-6 rounded-md shadow-sm border border-gray-100 w-full md:w-[55%]'>
                    <h2 className='text-sm font-semibold text-gray-800 mb-4'>
                        {activeTab}
                    </h2>
                    {activeTab === "Профіль" && !isLoading && user ? (
                        <div className='space-y-4 text-sm text-gray-700'>
                            <div className='flex items-center gap-3'>
                                <Image
                                className='w-16 h-16 rounded-full border border-gray-200'
                                src={user?.avatar || "https://ik.imagekit.io/q6fjhegkp/products/images.png?updatedAt=1749303973003"} alt='user logo' width={60} height={60}/>   
                                <button className='flex items-center gap-1 text-blue-500 text-xs font-medium'>
                                    <Pencil className='size-4' />
                                    Змінити фото
                                </button> 
                            </div>   
                            <p>
                                <span className='font-semibold'>Ім'я:</span> {user?.name}</p> 
                            <p><span className='font-semibold'>Електронна пошта:</span> {user?.email}</p>
                            <p><span className='font-semibold'>Зареєстрований:</span>{" "} {new Date(user.createdAt).toLocaleDateString()}</p>
                            <p><span className='font-semibold'>Бали:</span>{" "} {user?.points || 0}</p>
                        </div>
                    ): activeTab==="Адреса доставки" && !isLoading && user ? (
                        <ShippingAddressSection />
                    ): <></>}
                </div>

                {/* Right quick panel*/}
                <div className='w-full md:w-1/4 space-y-4'>
                    <QuickActionCard Icon={Gift} title="Реферальна програма" description="Запросіть друзів і отримайте бонуси!" />
                    <QuickActionCard Icon={BadgeCheck} title="Досягнення" description="Перегляд досягнень" />
                    <QuickActionCard Icon={Settings} title="Налаштування" description="Зміна налаштувань і безпеки профілю" />
                    <QuickActionCard Icon={Receipt} title="Платіжна історія" description="Перегляд останніх транзакцій" />
                    <QuickActionCard Icon={PhoneCall} title="Підтримка" description="Зв'яжіться з нами для отримання допомоги!" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Page;

const NavItem=({label,Icon,active,danger,onClick}:any)=>(
    <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${active ? "bg-blue-100 text-blue-600" : danger ? "text-red-500 hover:bg-red-50" : "text-gray-700 hover:bg-gray-100"} `}
    >
        <Icon className='size-4' />
        {label}
    </button>
)