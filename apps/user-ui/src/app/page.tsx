'use client';

import React from 'react'
import Hero from '../shared/modules/hero'
import SectionTitle from '../shared/widgets/header/components/section/section-title'
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import ProductCard from '../shared/widgets/header/components/cards/product-card';

const Page = () => {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-all-products?page=1&limit=10');
      return res.data.products;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const {
    data: latestProducts
  } = useQuery({
    queryKey: ['latest-products'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-all-products?page=1&limit=10&type=latest');
      return res.data.products;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });



  return (
    <div className='bg-[#f5f5f5]'>
      <Hero />
      <div className='md:w-[80%] w-[90%] m-auto my-10'>
        <div className='mb-8'>
          <SectionTitle title="Особливі пропозиції" />
        </div>

        {isLoading && (
          <div className='grid grid-cols-1 sm:grid-col-3 md:grid-cols-4 2xl:grid-cols-5 gap-5'>
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className='h-[250px] bg-gray-300 animate-pulse rounded-xl' />
            ))}
          </div>
        )}

        {!isLoading && !isError &&(
          <div className='m-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5'>
            {products?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Page