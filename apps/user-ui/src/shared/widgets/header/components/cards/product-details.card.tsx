import React, { useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import Ratings from '../ratings';
import { Heart, MapPin, ShoppingBag, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStore } from 'apps/user-ui/src/store';
import useUser from 'apps/user-ui/src/hooks/useUser';
import useLocationTracking from 'apps/user-ui/src/hooks/useLocationTracking';
import useDeviceTracking from 'apps/user-ui/src/hooks/useDeviceTracking';

const ProductDetailsCard = ({ data, setOpen }: { data: any, setOpen: (open: boolean) => void }) => {
    const [activeImage, setActiveImage] = useState(0);
    const [isSelected, setIsSelected] = useState(data?.colors?.[0] || "");
    const [isSizeSelected, setIsSizeSelected] = useState(data?.sizes?.[0] || "");
    const [quantity, setQuantity] = useState(1);
    const { user } = useUser();
    const location = useLocationTracking();
    const deviceInfo = useDeviceTracking();
    const addToCart = useStore((state: any) => state.addToCart);
    const addToWishlist = useStore((state: any) => state.addToWishlist);
    const removeFromWishlist = useStore((state: any) => state.removeFromWishlist);
    const wishlist = useStore((state: any) => state.wishlist);
    const isWishlisted = wishlist.some((item: any) => item.id === data.id);
    const cart = useStore((state: any) => state.cart);
    const isInCart = cart.some((item: any) => item.id === data.id);

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
    const router = useRouter();

    return (
        <div
            className='fixed flex items-center justify-center top-0 left-0 h-screen w-full bg-[#0000001d] z-50'
            onClick={() => setOpen(false)}
        >
            <div className='w-[90%] md:w-[70%] md:mt-14 2xl:mt-0 h-max min-h-[70vh] p-4 md:p-6 bg-white rounded-lg'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='w-full flex flex-col md:flex-row'>
                    <div className='w-full md:w-1/2 h-full'>
                        <Image
                            src={data?.images?.[activeImage]?.url}
                            alt={data?.images?.[activeImage]?.url || 'Product Image'}
                            width={400}
                            height={400}
                            className='w-full object-contain rounded-lg'
                        />
                        {/* Thumbnails */}
                        <div className='flex gap-2 mt-4'>
                            {data?.images?.map((img: any, index: number) => (
                                <div key={index}
                                    className={`cursor-pointer border rounded-md ${activeImage === index ? 'border-gray-500 pt-1' : 'border-transparent'}`}
                                    onClick={() => setActiveImage(index)}
                                >
                                    <Image
                                        src={img?.url}
                                        alt={`Thumbnail ${index}`}
                                        width={80}
                                        height={80}
                                        className='rounded-md'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='w-full md:w-1/2 md:pl-8 mt-6 md:mt-0'>
                        {/*Seller info*/}
                        <div className='border-b pb-3 border-gray-200 flex items-center justify-between relative'>

                            <div className='flex items-start gap-3'>
                                {/*Shop logo */}
                                {/*<Image
                                    src={data?.Shop?.avatar}
                                    alt='Shop Logo'
                                    width={60}
                                    height={60}
                                    className='rounded-full w-[60px] h-[60px] object-cover'
                                />*/}

                                <div>
                                    <Link
                                        href={`/shop/${data?.Shop?.id}`}
                                        className='text-lg font-medium'
                                    >
                                        {data?.Shop?.name}
                                    </Link>

                                    {/*Shop rating*/}
                                    <span className='block mt-1'>
                                        <Ratings rating={data?.Shop?.ratings} />
                                    </span>

                                    {/*Shop location*/}
                                    <p className='text-gray-600 mt-1 flex items-center gap-2'>
                                        <MapPin size={20} />{" "}
                                        {data?.Shop?.address || 'Локація не вказана'}
                                    </p>
                                </div>
                            </div>

                            {/* Chat with Seller Button */}
                            <button
                                className='flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition'
                                onClick={() => router.push(`/inbox?shopId=${data?.Shop?.id}`)}
                            >
                                💬
                            </button>

                            <button className='w-full absolute cursor-pointer right-[-5px] top-[-5px] flex justify-end my-2 mt-[-10px]'>
                                <X size={25} onClick={() => setOpen(false)} />
                            </button>
                        </div>

                        <h3 className='text-xl font-semibold mt-3'>{data?.title}</h3>

                        <p className='mt-2 text-gray-700 whitespace-pre-wrap w-full'>
                            {data?.short_description || 'Опис не вказано'}
                        </p>

                        {/*Barnd*/}
                        {data?.brand && (
                            <p className='mt-2 text-gray-600'>
                                <span className='font-semibold'>Бренд:</span> {data?.brand}
                            </p>
                        )}

                        {/*Color & Size Selection*/}
                        <div className='flex flex-col md:flex-row items-start gap-5 mt-4'>
                            {/*Color Selection */}
                            {data?.colors.length > 0 && (
                                <div>
                                    <strong>Колір:</strong>
                                    <div className='flex gap-2 mt-1'>
                                        {data?.colors.map((color: string, index: number) => (
                                            <button
                                                key={index}
                                                className={`w-8 h-8 rounded-full cursor-pointer border-2 transition ${isSelected === color ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setIsSelected(color)}
                                            ></button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/*Size Selection */}
                            {data?.sizes.length > 0 && (
                                <div>
                                    <strong>Розмір:</strong>
                                    <div className='flex gap-2 mt-1'>
                                        {data.sizes.map((size: string, index: number) => (
                                            <button
                                                key={index}
                                                className={`px-4 py-1 border rounded-md cursor-pointer transition ${isSizeSelected === size ? 'border-gray-800 ' : 'bg-gray-300 text-black'}`}
                                                onClick={() => setIsSizeSelected(size)}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>


                        {/*Price*/}
                        <div className='mt-5 flex items-center gap-4'>
                            <h3 className='text-2xl font-semibold text-gray-900'>
                                ₴{data?.sale_price}
                            </h3>
                            {data?.regular_price && (
                                <h3 className='text-lg text-red-600 line-through'>
                                    ₴{data?.regular_price}
                                </h3>
                            )}
                        </div>

                        <div className='mt-5 flex items-center gap-5'>
                            <div className='flex items-center rounded-md'>
                                <button className='px-3 cursor-pointer py-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-l-md'
                                    onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                                >
                                    -
                                </button>
                                <span className='px-4 bg-gray-100 py-1'>{quantity}</span>
                                <button className='px-3 cursor-pointer py-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-r-md'
                                    onClick={() => setQuantity((prev) => prev + 1)}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                disabled={isInCart}
                                onClick={() => addToCart({
                                    ...data,
                                    quantity,
                                    selectedOptions: {
                                        color: isSelected,
                                        size: isSizeSelected
                                    },
                                },
                                    user,
                                    location,
                                    deviceInfo
                                )}
                                className={`flex items-center gap-2 px-4 py-2 bg-[#ff5722] hover:bg-[#e64a19] text-white rounded-lg transition ${isInCart ? "cursor-not-allowed" : "cursor-pointer"}`}>
                                <ShoppingBag size={18} />
                                Додати до кошика
                            </button>
                            <button className='opacity-[.7] cursor-pointer '>
                                <Heart
                                    size={30}
                                    fill={isWishlisted ? 'red' : 'transparent'} color={isWishlisted ? 'transparent' : "black"}
                                    onClick={() =>
                                        isWishlisted
                                            ? removeFromWishlist(data.id, user, location, deviceInfo)
                                            : addToWishlist(
                                                {
                                                    ...data,
                                                    quantity: 1,
                                                    selectedOptions: {
                                                        color: isSelected,
                                                        size: isSizeSelected
                                                    },
                                                },
                                                user,
                                                location,
                                                deviceInfo
                                            )
                                    }
                                />
                            </button>
                        </div>
                        <div className='mt-3'>
                            {data.stock > 0 ? (
                                <span className='text-green-600 font-semibold'>
                                    В наявності: {data.stock} шт.
                                </span>
                            ) : (
                                <span className='text-red-600 font-semibold'>
                                    Немає в наявності
                                </span>
                            )}
                        </div>{" "}
                        <div className='mt-3 text-gray-600 text-sm'>
                            Орієнтований час доставки:{" "}
                            <strong>{estimatedDelivery.toLocaleDateString()}</strong>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailsCard;