'use client'
import { navItems } from 'apps/user-ui/src/configs/constants';
import useUser from 'apps/user-ui/src/hooks/useUser';
import { useStore } from 'apps/user-ui/src/store';
import { AlignLeft, ChevronDown, HeartIcon, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

function HeaderBottom() {
    const [show, setShow] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const wishlist = useStore((state: any) => state.wishlist);
    const cart = useStore((state: any) => state.cart);
    const { user, isLoading } = useUser();

    //track scroll position
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <div className={`w-full transition-all  bg-white pb-3 duration-300 ${isSticky ? 'fixed top-0 left-0 z-[100 shadow-lg' : 'relative'} `}
        >
            <div className={`w-[80%] relative m-auto flex items-center justify-between 
            ${isSticky ? 'pt-3' : 'py-0'} `}
            >
                {/*All dropdowns */}
                <div className={`w-[260px]  ${show ? 'rounded-t-[24px]' : "rounded-[24px]"} ${isSticky && '-mb-2'} cursor-pointer flex items-center justify-between px-5 h-[50px] bg-[#3489ff]`}
                    onClick={() => setShow(!show)}
                >
                    <div className='flex items-center gap-2'>
                        <AlignLeft color='white' />
                        <span className='text-white font-medium'>Категорії</span>
                    </div>
                    <ChevronDown color='white' />
                </div>

                {/*Dropdown menu */}
                {show && (
                    <div className={`absolute left-0 ${isSticky ? 'top-[70px]' : 'top-[50px]'} rounded-b-[24px] w-[260px] h-[400px] bg-[#f5f5f5] `}>

                    </div>
                )}

                {/*Navigation links */}
                <div className='flex items-center'>
                    {navItems.map((i: NavItemsTypes, index: number) => (
                        <Link className='px-5 font-medium text-lg' href={i.href} key={index}>
                            {i.title}
                        </Link>
                    ))}
                </div>

                <div>
                    {isSticky && (
                        <div className='flex items-center gap-8'>
                            <div className='flex items-center gap-2 cursor-pointer'>
                                {!isLoading && user ? (
                                    <>
                                        <Link href={"/profile"} className='border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]'>
                                            <User />
                                        </Link>
                                        <Link href={"/profile"}>
                                            <span className='block font-medium'>Привіт!</span>
                                            <span className='font-semibold'>{user?.name?.split(" ")[0]}</span>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href={"/login"} className='border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]'>
                                            <User />
                                        </Link>
                                        <Link href={"/login"}>
                                            <span className='block font-medium'>Привіт!</span>
                                            <span className='font-semibold'>{isLoading ? "..." : "Реєстрація"}</span>
                                        </Link>
                                    </>
                                )
                                }
                            </div>
                            <div className='flex items-center gap-5'>
                                <Link href={"/wishlist"} className='relative'>
                                    <HeartIcon className='w-[30px] h-[30px]' />
                                    <div className='w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute -top-[-10px] right-[-10px]'>
                                        <span className='text-white font-medium text-sm'>{wishlist.length}</span>
                                    </div>
                                </Link>
                                <Link href={"/cart"} className='relative'>
                                    <ShoppingCart className='w-[30px] h-[30px]' />
                                    <div className='w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute -top-[-10px] right-[-10px]'>
                                        <span className='text-white font-medium text-sm'>{cart.length}</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HeaderBottom