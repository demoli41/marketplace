'use client';

import { ChevronLeft, ChevronRight, Heart, MapPin, MessageSquareText, Package, WalletMinimal } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Ratings from '../../widgets/header/components/ratings';
import Link from 'next/link';
import { useStore } from 'apps/user-ui/src/store';
import useUser from 'apps/user-ui/src/hooks/useUser';
import useLocationTracking from 'apps/user-ui/src/hooks/useLocationTracking';
import useDeviceTracking from 'apps/user-ui/src/hooks/useDeviceTracking';
import ProductCard from '../../widgets/header/components/cards/product-card';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';


const ProductDetails = ({ productDetails }:{productDetails: any}) => {


    const {user,isLoading} = useUser();
    const location=useLocationTracking();
    const deviceInfo=useDeviceTracking();

    const [currentImage,setCurrentImage]=useState(productDetails?.images?.[0]?.url);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSelectedColor, setIsSelectedColor] = useState(productDetails?.colors?.[0] || '');
    const [isSizeSelected, setIsSizeSelected] = useState(productDetails?.sizes?.[0] || '');
    const [quantity, setQuantity] = useState(1);
    const [priceRange, setPriceRange] = useState([
        productDetails?.sale_price,
        1199,
    ]);
    const [recomendedProducts, setRecomendedProducts] = useState([]);

 const addToCart = useStore((state: any) => state.addToCart);
    const addToWishlist=useStore((state:any) => state.addToWishlist);
    const removeFromWishlist=useStore((state:any) => state.removeFromWishlist);
    const wishlist = useStore((state:any) => state.wishlist);
    const isWishlisted=wishlist.some((item:any) => item.id === productDetails.id);
    const cart= useStore((state:any) => state.cart);
    const isInCart=cart.some((item:any) => item.id === productDetails.id);

    const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentImage(productDetails?.images[currentIndex - 1]);
    }
  };

  const nextImage = () => {
    if (currentIndex < productDetails?.images?.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentImage(productDetails?.images[currentIndex + 1]);
    }
  };

  const discountPercentage = ((productDetails?.regular_price - productDetails?.sale_price) / productDetails?.regular_price) * 100;

  const fetchFilteredProducts = async () => {
    try{
      const query=new URLSearchParams();

      query.set("priceRange",priceRange.join(','));
      query.set("page","1");
      query.set("limit","5");

      const res=await axiosInstance.get(`/product/api/get-filtered-products?${query.toString()}`);
      setRecomendedProducts(res.data.products);
    }catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };

  useEffect(()=>{
    fetchFilteredProducts();
  },[priceRange])

  return (
    <div className='w-full bg-[#f5f5f5] py-5'>
        <div className='w-[90%] bg-white lg:w-[80%] mx-auto pt-6 grid grid-cols-1 lg:grid-cols-[32%_40%_28%] gap-6 overflow-hidden'>
            {/* Left Section */}
            <div className='p-4'>
                <div className='relative w-full'>
                    {/*Main image with zoom */}
                    <Image
                      src={currentImage}
                      alt="Product Image"
                      width={400}
                      height={400}
                    />
                </div>
                {/* Thumbnails */}
                <div className='relative flex items-center gap-2 mt-4 overflow-hidden'>
                    {productDetails?.images?.length > 4 && (
                      <button
                      disabled={currentIndex===0}
                      onClick={prevImage}
                        className='absolute left-0 z-10 bg-white rounded-full p-2 shadow-md'
                      >
                        <ChevronLeft size={24}/>
                      </button>
                    )}
                    <div className='flex gap-2 overflow-x-auto '>
                      {productDetails?.images?.map((img:any, index:number) => (
                        <Image
                          key={index}
                          src={img?.url}
                          alt={`Thumbnail ${index + 1}`}
                          width={60}
                          height={60}
                          className={`cursor-pointer border rounded-lg p-1 ${currentImage === img ? ' border-blue-500' : 'border-gray-300'}`}
                          onClick={() => {
                            setCurrentImage(img);
                            setCurrentIndex(index);
                          }}
                        />
                      ))}
                    </div>
                      {productDetails?.images?.length > 4 && (
                      <button
                      disabled={currentIndex===productDetails?.images?.length-1}
                      onClick={nextImage}
                        className='absolute right-0 z-10 bg-white rounded-full p-2 shadow-md'
                      >
                        <ChevronRight size={24}/>
                      </button>
                    )}
                </div>
            </div>
        {/* Details Section */}
        <div className='p-4'>
                <h1 className='text-xl mb-2 font-medium'>
                  {productDetails?.title || 'Product Title'}
                </h1>
                <div className='w-full flex items-center justify-between'>
                    <div className='flex gap-2 mt-2 text-yellow-500'>
                      <Ratings rating={productDetails?.rating} />
                      <Link href={"#reviews"} className='text-blue-500 hover:underline'>(0 відгуків)</Link>
                    </div>
                 <div>
                  <Heart
                  size={25}
                  fill={isWishlisted ? 'red' : 'transparent'}
                  className='cursor-pointer'
                  color={isWishlisted ? 'transparent' : '#777'}
                  onClick={()=>
                    isWishlisted ?
                    removeFromWishlist(productDetails.id, user, location, deviceInfo)
                    : addToWishlist({...productDetails,selectedOptions:{
                      color: isSelectedColor,
                      size: isSizeSelected,
                    }}, user, location, deviceInfo)
                  }
                  />
                </div>
                </div>
                <div className='py-2 border-b border-gray-200'>
                    <span className='text-gray-500'>
                      Бренд: {" "}
                      <span className='text-blue-500'>
                        {productDetails?.brand || 'Unknown Brand'}
                      </span>
                    </span>
                </div>

                <div className='mt-3'>
                    <span className='text-3xl font-bold text-red-500'>
                      {productDetails?.sale_price} ₴
                    </span>
                    <div className='flex gap-2 pb-2 text-lg border-b border-b-slate-200'>
                      <span className='text-gray-400 line-through'>
                        {productDetails?.regular_price} ₴
                      </span>
                      <span className='text-gray-500'>
                        -{discountPercentage.toFixed(0)}%
                      </span>
                    </div>

                    <div className='mt-2'>
                      <div className='flex flex-col gap-5 mt-4 md:flex-row' >
                        {/*Color Selection*/}
                        {productDetails?.colors.length > 0 && (
                          <div>
                            <strong>Кольори:</strong>
                              <div className='flex gap-2 mt-1'>
                                {
                                  productDetails?.colors?.map((color:string, index:number) => (
                                    <button
                                      key={index}
                                      className={`w-8 h-8 cursor-pointer rounded-full border-2 transition ${isSelectedColor ===color ? 'border-gray-400 scale-110 shadow-md' : 'border-transparent'}`}
                                      onClick={() => setIsSelectedColor(color)}
                                      style={{ backgroundColor: color }}
                                    />
                                  ))
                                }
                              </div>
                          </div>
                        )}

                        {/*Size Selection*/}
                        {productDetails?.sizes.length > 0 && (
                          <div>
                            <strong>Розміри:</strong>
                              <div className='flex gap-2 mt-1'>
                                {
                                  productDetails?.sizes?.map((size:string, index:number) => (
                                    <button
                                      key={index}
                                      className={`px-4 py-1 cursor-pointer rounded-md transition ${isSizeSelected === size ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}
                                      onClick={() => setIsSizeSelected(size)}
                                    >
                                      {size}
                                    </button>
                                  ))
                                }
                              </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='mt-6'>
                      <div className='flex items-center gap-3'>
                        <div className="flex items-center rounded-md">
                          <button 
                          onClick={()=>setQuantity((prev)=>Math.max(prev-1, 1))}
                          className='px-3 cursor-pointer py-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-l-md'>
                            -
                          </button>
                          <span className='px-4 bg-gray-100 py-1'>{quantity}</span>
                          <button
                          onClick={()=>setQuantity((prev)=>prev+1)}
                          className='px-3 cursor-pointer py-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-r-md'>
                            +
                          </button>
                        </div>
                        {productDetails?.stock > 0 ? (
                          <span className='text-green-600 font-semibold'>
                            В наявності: {" "}
                            <span className='text-gray-500 font-medium'>
                              {productDetails?.stock} шт.
                            </span>
                          </span>
                        ) : (
                          <span className='font-semibold text-red-600'>
                            Немає в наявності
                          </span>
                        )}

                      </div>
                      <button className={`flex mt-6 items-center gap-2 px-5 py-[10px] bg-[#3489ff] hover:bg-[#3442ff] text-white font-medium rounded-lg transition ${isInCart || productDetails?.stock===0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      onClick={()=>
                        addToCart({
                          ...productDetails,
                          quantity,
                          selectedOptions: {
                            color: isSelectedColor,
                            size: isSizeSelected,
                          },
                        },
                      user,
                      location,
                      deviceInfo
                      )
                      }
                      >
                        <span className='text-lg'>Додати до кошика</span>
                        <span className='text-2xl'>🛒</span>
                      </button>
                    </div>
                </div>
        </div>

        {/* Right Section */}
        <div className='bg-[#fafafa] -mt-6'>
          <div className='mb-1 p-3 border-b border-b-gray-100'>
            <span className='text-sm text-gray-600'>Деталі доставки</span>
            <div className='flex items-center text-gray-600 gap-1'>
              <MapPin size={18} className='ml-[-5px]'/>
              <span className='text-lg font-normal'>
                {(location?.city + ', ' + location?.country) || 'Ваша локація не вказана'}
              </span>
            </div>
          </div>

          <div className='mb-1 px-3 pb-1 border-b border-b-gray-100'>
              <span className='text-sm text-gray-600'>Повернення і гарантія</span>
              <div className='flex items-center text-gray-600 gap-1'>
                <Package size={18} className='ml-[-5px]'/>
                <span className='text-base font-normal'>
                  {productDetails?.return_policy || 'Повернення протягом 14 днів '}
                </span>
              </div>
              <div className='flex items-center py-2 text-gray-600 gap-1'>
                <WalletMinimal size={18} className='ml-[-5px]'/>
                    <span className='text-base font-normal'>
                      Гарантія не поширюється на цей товар
                    </span>
              </div>
          </div>

          <div className='px-3 py-1'>
            <div className='w-[85%] rounded-lg'>
              {/*Sold by Section*/}
              <div className='flex items-center justify-between'>
                <div>
                  <span className='tex-sm text-gray-600 font-light'>
                    Продавець:
                  </span>
                  <span className='block max-w-[150px] truncate font-medium text-lg'>
                    {productDetails?.Shop?.name}
                  </span>
                </div>
                <Link href={`#`}
                className='text-blue-500 items-center flex gap-1 text-sm'>
                  <MessageSquareText/>
                  Зв'язатися з продавцем
                </Link>
              </div>

              {/* Seller stats */}
              <div className='grid grid-cols-3 gap-2 border-t border-t-gray-200 mt-3 pt-2'>
                <div>
                  <p className='text-[12px] text-gray-500'>
                    Позитивні відгуки продавця
                  </p>
                  <p className='text-lg font-semibold'>87%</p>
                </div>
                                <div>
                  <p className='text-[12px] text-gray-500'>
                    Вчасна доставка товару
                  </p>
                  <p className='text-lg font-semibold'>93%</p>
                </div>
                                <div>
                  <p className='text-[12px] text-gray-500'>
                    Відповідь на запитання
                  </p>
                  <p className='text-lg font-semibold'>100%</p>
                </div>
              </div>

              {/* Go to store */}
              <div className='text-center mb-2 mt-4 border-t border-t-gray-200 pt-2'>
                  <Link href={`/shop/${productDetails?.Shop?.id}`} className='text-blue-500 font-medium hover:underline text-sm'>
                    Перейти до магазину
                  </Link>
              </div>
            </div>
          </div>
        </div>
        </div>

        <div className='w-[90%] lg:w-[80%] mx-auto mt-5'>
            <div className='bg-white min-h-[60vh] h-full p-5'>
              <h3 className='text-lg font-semibold'>Опис товару:</h3>
              <div className='prose prose-sm text-slate-200 max-w-none'
              dangerouslySetInnerHTML={{ __html: productDetails?.detailed_description,}}
              />
            </div>
        </div>

        <div className='w-[90%] lg:w-[80%] mx-auto'>
          <div className='bg-white min-h-[50vh] h-full mt-5 p-5'>
            <h3 className='text-lg font-semibold'>Відгуки і оцінки товару:</h3>
            <p className='text-center pt-14'>Немає відгуків про цей товар.</p>
          </div>
        </div>

        <div className='w-[90%] lg:w-[80%] mx-auto'>
          <div className='w-full h-full my-5 p-5'>
            <h3 className='text-lg mb-2 font-semibold'>Вам також може сподобатися:</h3>
            <div className='m-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5'>
              {recomendedProducts?.map((i:any)=>(
                <ProductCard key={i.id} product={i} />
              ))}
            </div>
          </div>
        </div>
    </div>
  )
}

export default ProductDetails