'use client';

import { useQuery } from '@tanstack/react-query';
import ProductCard from 'apps/user-ui/src/shared/widgets/header/components/cards/product-card';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Range } from 'react-range';

const MIN = 0;
const MAX = 10000;

const Page = () => {
    const router = useRouter();

    const [isProductLoading, setIsProductLoading] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [tempPriceRange, setTempPriceRange] = useState([0, 10000]);

    const colors=[
        {label:"чорний",name:"Black", code:"#000000"},
        {label:"білий",name:"White", code:"#FFFFFF"},
        {label:"червоний",name:"Red", code:"#FF0000"},
        {label:"зелений",name:"Green", code:"#00FF00"},
        {label:"синій",name:"Blue", code:"#0000FF"},
        {label:"жовтий",name:"Yellow", code:"#FFFF00"},
        {label:"помаранчевий",name:"Orange", code:"#FFA500"},
        {label:"фіолетовий",name:"Purple", code:"#800080"},
    ];

    const sizes=[
        "XS","S","M","L","XL","XXL"
    ];

    const updateUrl = () => {
        const params = new URLSearchParams();
        params.set('priceRange', priceRange.join(','));
        if (selectedCategories.length > 0) {
            params.set("categories", selectedCategories.join(','));
        }
        if (selectedColors.length > 0) {
            params.set("colors", selectedColors.join(','));
        }
        if (selectedSizes.length > 0) {
            params.set("sizes", selectedSizes.join(','));
        }
        params.set("page", page.toString());
        router.replace(`/offers?${decodeURIComponent(params.toString())}`);
    }

    const fetchFilteredProducts = async () => {
        setIsProductLoading(true);
        try {
            const query = new URLSearchParams();

            query.set("priceRange", priceRange.join(','));
            if (selectedCategories.length > 0) {
                query.set("categories", selectedCategories.join(','));
            }
            if (selectedColors.length > 0) {
                query.set("colors", selectedColors.join(','));
            }
            if (selectedSizes.length > 0) {
                query.set("sizes", selectedSizes.join(','));
            }
            query.set("page", page.toString());
            query.set("limit", "12");

            const res = await axiosInstance.get(`product/api/get-filtered-offers?${query.toString()}`);


            setProducts(res.data.products);
            console.log(res.data.products);
            setTotalPages(res.data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsProductLoading(false);
        }
    };

    useEffect(() => {
        updateUrl();
        fetchFilteredProducts();
    }, [priceRange, selectedCategories, selectedSizes, selectedColors, page])

    const { data, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await axiosInstance.get('product/api/get-categories');
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const toggleCategory = (label: string) => {
        setSelectedCategories((prev) =>
            prev.includes(label)
                ? prev.filter((cat) => cat !== label)
                : [...prev, label]
        );
    };

    const toggleColor = (label: string) => {
        setSelectedColors((prev) =>
            prev.includes(label)
                ? prev.filter((col) => col !== label)
                : [...prev, label]
        );
    };

    const toggleSize = (size: string) => {
        setSelectedSizes((prev) =>
            prev.includes(size)
                ? prev.filter((s) => s !== size)
                : [...prev, size]
        );
    };

    return (
        <div className='w-full bg-[#f5f5f5] pb-10'>
            <div className='w-[90%] lg:w-[80%] m-auto'>
                <div className='pb-[50px]'>
                    <h1 className='md:pt-[40px] font-medium text-[44px] leading-1 mb-[14px] font-jost'>Всі пропозиції</h1>
                    <Link href='/' className='text-[#55585b] hover:underline'>Головна</Link>
                    <span className='inline-block mx-1 p-[1.5px] bg-[#a8acb0] rounded-full'></span>
                    <span className='text-[#55585b]'>Всі пропозиції</span>
                </div>

                <div className='w-full flex flex-col lg:flex-row gap-8'>
                    {/*aside filter section*/}

                    <aside className='w-full lg:w-[270px] bg-white space-y-6 p-4 !rounded shadow-md'>
                        <h3 className='font-Poppins text-xl font-medium'>Ціна</h3>
                        <div className='px-2'>
                            <Range
                                step={10}
                                min={MIN}
                                max={MAX}
                                values={tempPriceRange}
                                onChange={(values) => setTempPriceRange(values)}
                                renderTrack={({ props, children }) => {
                                    const [minVal, maxVal] = tempPriceRange;
                                    const percentageLeft = ((minVal - MIN) / (MAX - MIN)) * 100;
                                    const percentageRight = ((maxVal - MIN) / (MAX - MIN)) * 100;

                                    return (
                                        <div
                                            {...props}
                                            style={{
                                                ...props.style,
                                                height: "6px",
                                                width: "100%",
                                                background: "#bfdbfe",
                                                borderRadius: "4px",
                                                position: "relative",
                                                display: "flex",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    height: "6px",
                                                    background: "#2563eb",
                                                    borderRadius: "4px",
                                                    left: `${percentageLeft}%`,
                                                    width: `${percentageRight - percentageLeft}%`,
                                                }}
                                            />
                                            {children}
                                        </div>
                                    );
                                }}
                                renderThumb={({ props }) => {
                                    const { key, ...restProps } = props;
                                    return (
                                      <div
                                        key={key}
                                        {...restProps}
                                        style={{
                                          ...restProps.style,
                                          height: "16px",
                                          width: "16px",
                                          backgroundColor: "#2563eb",
                                          borderRadius: "50%",
                                          boxShadow: "0 0 4px rgba(0,0,0,0.3)",
                                          outline: 'none' 
                                        }}
                                      />
                                    );
                                }}
                            />
                        </div>
                        <div className='flex justify-between items-center mt-2'>
                            <div className='text-sm text-gray-600'>{`$${tempPriceRange[0]} - $${tempPriceRange[1]}`}</div>
                            <button
                            onClick={()=>{
                                setPriceRange(tempPriceRange);
                                setPage(1);
                            }} 
                            className='text-sm px-4 py-1 bg-gray-200 hover:bg-blue-600 hover:text-white transition !rounded'>
                                Застосувати
                            </button>
                        </div>
                    
                        {/*Categories*/}
                        <h3 className='font-Poppins text-xl font-medium border-b border-b-slate-300 pb-1'>
                            Категорії
                        </h3>

                        <ul className='space-y-2 !mt-3'>
                            {isLoading ? (
                                <p>Завантаження...</p>
                            ) : (
                                data?.categories?.map((category:any)=>(
                                    <li 
                                    key={category}
                                    className='flex items-center justify-between'
                                    >
                                        <label className='flex items-center gap-3 text-sm text-gray-700'>
                                            <input 
                                            checked={selectedCategories.includes(category)}
                                            type="checkbox"
                                            onChange={()=>toggleCategory(category)}
                                            className='accent-blue-600'
                                            />
                                            {category}
                                        </label>
                                    </li>
                                ))
                            )}
                        </ul>

                         <h3 className='font-Poppins text-xl font-medium border-b border-b-slate-300 pb-1'>
                            Кольори
                        </h3>

                        <ul className='space-y-2 !mt-3'>
                            {isLoading ? (
                                <p>Завантаження...</p>
                            ) : (
                                colors?.map((color:any)=>(
                                    <li 
                                    key={color.name}
                                    className='flex items-center justify-between'
                                    >
                                        <label className='flex items-center gap-2 text-sm cursor-pointer text-gray-700'>
                                            <input 
                                            checked={selectedColors.includes(color.code)}
                                            type="checkbox"
                                            onChange={()=>toggleColor(color.code)}
                                            className='accent-blue-600'
                                            />
                                            <span
                                            className='w-[16px] h-[16px] rounded-full border border-gray-200'
                                            style={{
                                                backgroundColor: color.code,
                                            }}
                                            >
                                            </span>
                                            {color.name}
                                        </label>
                                    </li>
                                ))
                            )}
                        </ul>

                        <h3 className='font-Poppins text-xl font-medium border-b border-b-slate-300 pb-1'>
                            Розміри
                        </h3>

                        <ul className='space-y-2 !mt-3'>
                            {sizes?.map((size:any)=>(
                                <li 
                                key={size}
                                className='flex items-center justify-between'
                                >
                                    <label className='flex items-center gap-3 text-sm text-gray-700'>
                                        <input 
                                        checked={selectedSizes.includes(size)}
                                        type="checkbox"
                                        onChange={()=>toggleSize(size)}
                                        className='accent-blue-600'
                                        />
                                        {size}
                                    </label>
                                </li>
                            ))}
                        </ul>

                    </aside>

                    {/*Products grid*/}
                    <div className='flex-1 px-2 lg:px-3'>
                        {isProductLoading ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
                                {Array.from({ length: 10}).map((_, index) => (
                                    <div key={index}
                                    className='h-[250px] bg-gray-300 animate-pulse rounded-xl'
                                    ></div>
                                ))}
                            </div>
                        ) :products.length > 0 ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <p>Товарів не знайдено</p>
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