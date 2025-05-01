import React from 'react'
import Link from 'next/link'
import { HeartIcon, Search, ShoppingCart } from 'lucide-react'
import { User } from 'lucide-react'
import HeaderBottom from './headerBottom'

const Header=()=> {
  return (
    <div className='w-full bg-white'>
        <div className='w-[80%] py-5 m-auto flex items-center justify-between'>
            <div>
                <Link href={"/"}>
                    <span className='text-3xl font-[500]'>
                        Marketplace
                    </span>
                </Link>
            </div>
            <div className='w-[50%] relative '>
                <input 
                type="text" 
                placeholder='Пошку товарів...' 
                className='rounded-full w-full  px-4 font-Poppins font-medium border-[2.5px] border-[#3489FF] outline-none h-[55px]'/>
                <div className='hover:scale-105 transition ease-in-out rounded-full w-[60px] cursor-pointer flex items-center justify-center h-[55px] bg-[#3489FF] absolute top-0 right-0'>
                    <Search color='#fff'/>
                </div>
                
            </div>
            <div className='flex items-center gap-8'>
                    <div className='flex items-center gap-2 cursor-pointer'>
                        <Link href={"/login"} className='border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]'>
                            <User/>
                        </Link>
                        <Link href={"/login"}>
                            <span className='block font-medium'>Привіт!</span>
                            <span className='font-semibold'>Реєстрація</span>
                        </Link>
                    </div>
                    <div className='flex items-center gap-5'>
                        <Link href={"/wishlist"} className='relative'>
                            <HeartIcon className='w-[30px] h-[30px]' />
                            <div className='w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute -top-[-10px] right-[-10px]'>
                                <span className='text-white font-medium text-sm'>0</span>
                            </div>
                        </Link>
                        <Link href={"/cart"} className='relative'>
                            <ShoppingCart className='w-[30px] h-[30px]' />
                            <div className='w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute -top-[-10px] right-[-10px]'>
                                <span className='text-white font-medium text-sm'>0</span>
                            </div>
                        </Link>
                    </div>
                </div>
        </div>
        <div className='border-b border-b-[#99999938]'/>
            <HeaderBottom/>
    </div>
  )
}

export default Header