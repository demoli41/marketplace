'use client';

import { categories } from 'apps/user-ui/src/configs/categories';
import { countries } from 'apps/user-ui/src/configs/countries';
import ShopCard from 'apps/user-ui/src/shared/widgets/header/components/cards/shop.card';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'



const Page = () => {
    const router = useRouter();

    const [isShopLoading, setIsShopLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [shops, setShops] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const updateUrl = () => {
        const params = new URLSearchParams();
        if (selectedCategories.length > 0) {
            params.set("categories", selectedCategories.join(','));
        }
        if (selectedCountries.length > 0) {
            params.set("countries", selectedCountries.join(','));
        }
        params.set("page", page.toString());
        router.replace(`/shops?${decodeURIComponent(params.toString())}`);
    }

    const fetchFilteredShops = async () => {
        setIsShopLoading(true);
        try {
            const query = new URLSearchParams();

            if (selectedCategories.length > 0) {
                query.set("categories", selectedCategories.join(','));
            }
            if (selectedCountries.length > 0) {
                query.set("countries", selectedCountries.join(','));
            }
            query.set("page", page.toString());
            query.set("limit", "12");

            const res = await axiosInstance.get(`product/api/get-filtered-shops?${query.toString()}`);

            setShops(res.data.shops);
            console.log(res.data.shops);
            setTotalPages(res.data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching shops:", error);
        } finally {
            setIsShopLoading(false);
        }
    };

    useEffect(() => {
        updateUrl();
        fetchFilteredShops();
    }, [ selectedCategories, page])

    const toggleCategory = (label: string) => {
        setSelectedCategories((prev) =>
            prev.includes(label)
                ? prev.filter((cat) => cat !== label)
                : [...prev, label]
        );
    };

    const toggleCountry = (label: string) => {
        setSelectedCountries((prev) =>
            prev.includes(label)
                ? prev.filter((col) => col !== label)
                : [...prev, label]
        );
    };

    return (
        <div className='w-full bg-[#f5f5f5] pb-10'>
            <div className='w-[90%] lg:w-[80%] m-auto'>
                <div className='pb-[50px]'>
                    <h1 className='md:pt-[40px] font-medium text-[44px] leading-1 mb-[14px] font-jost'>Всі магазини</h1>
                    <Link href='/' className='text-[#55585b] hover:underline'>Головна</Link>
                    <span className='inline-block mx-1 p-[1.5px] bg-[#a8acb0] rounded-full'></span>
                    <span className='text-[#55585b]'>Всі магазини</span>
                </div>

                <div className='w-full flex flex-col lg:flex-row gap-8'>
                    {/*aside filter section*/}

                    <aside className='w-full lg:w-[270px] bg-white space-y-6 p-4 !rounded shadow-md'>
                    
                        {/*Categories*/}
                        <h3 className='font-Poppins text-xl font-medium border-b border-b-slate-300 pb-1'>
                            Категорії
                        </h3>

                        <ul className='space-y-2 !mt-3'>
                               { categories?.map((category:any)=>(
                                    <li 
                                    key={category.label}
                                    className='flex items-center justify-between'
                                    >
                                        <label className='flex items-center gap-3 text-sm text-gray-700'>
                                            <input 
                                            checked={selectedCategories.includes(category.value)}
                                            type="checkbox"
                                            onChange={()=>toggleCategory(category.value)}
                                            className='accent-blue-600'
                                            />
                                            {category.label}
                                        </label>
                                    </li>
                                ))
                            }
                        </ul>

                        {/*Countries*/}
                        <h3 className='font-Poppins text-xl font-medium border-b border-b-slate-300 pb-1'>
                            Країни
                        </h3>    

                        <ul className='space-y-2 !mt-3'>
                            {countries.map((country:any) => (
                                <li key={country} className='flex items-center justify-between'>
                                    <label className='flex items-center gap-3 text-sm text-gray-700 cursor-pointer'>
                                        <input
                                            checked={selectedCountries.includes(country)}
                                            type="checkbox"
                                            onChange={() => toggleCountry(country)}
                                            className='accent-blue-600'
                                        />
                                        {country}
                                    </label>
                                </li>
                            ))}
                        </ul>

                    </aside>

                    {/*Shop grid*/}
                    <div className='flex-1 px-2 lg:px-3'>
                        {isShopLoading ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
                                {Array.from({ length: 10}).map((_, index) => (
                                    <div key={index}
                                    className='h-[250px] bg-gray-300 animate-pulse rounded-xl'
                                    ></div>
                                ))}
                            </div>
                        ) : shops.length > 0 ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
                                {shops.map((shop) => (
                                    <ShopCard key={shop.id} shop={shop} />
                                ))}
                            </div>
                        ) : (
                            <p>Магазинів не знайдено</p>
                        )}

                        {totalPages>1 && (
                            <div className='flex justify-center mt-8 gap-2'>
                                {Array.from({length:totalPages}).map((_, index) => (
                                    <button
                                    key={index+1}
                                    onClick={()=>setPage(index+1)}
                                    className={`px-3 py-1 !rounded border border-gray-200 text-sm ${page === index+1 ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}
                                    >{index+1}</button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;