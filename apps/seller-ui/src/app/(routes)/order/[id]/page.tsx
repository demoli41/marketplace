'use client';

import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import {  ArrowLeftCircle, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'


const statuses=[
    "Ordered",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
];

const Page = () => {

    const params=useParams();
    const orderId=params.id as string;

    const [order,setOrder]=useState<any>(null);
    const [loading,setLoading]=useState(true);
    const [updating,setUpdating]=useState(false);
    const router=useRouter();

    const fetchOrder=async()=>{
        try{
            const res=await axiosInstance.get(`/order/api/get-order-details/${orderId}`);
            setOrder(res.data.order);
        } catch(err){
            setLoading(false);
            console.error("Failed to fetch order details",err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange=async(
        e: React.ChangeEvent<HTMLSelectElement>
    )=>{
        const newStatus=e.target.value;
        setUpdating(true);
        try{
            const res=await axiosInstance.put(`/order/api/update-status/${orderId}`,{deliveryStatus:newStatus});
            setOrder((prev:any)=>({...prev,deliveryStatus:newStatus}));
            console.log("Відповідь сервера:",res.data)
        } catch(err){
            console.error("Failed to update order status",err);
        } finally {
            setUpdating(false);
        }
    };

    useEffect(()=>{
        if(orderId)fetchOrder();
    },[orderId]);

    if(loading){
        return(
            <div className='flex justify-center items-center h-[40vh]'>
                <Loader2 className='animate-spin size-6 text-gray-600' />
            </div>
        )
    }

    if(!order){
        return <p className='text-center text-sm text-red-500'>Order not found.</p>
    }

  return (
    <div className='max-w-5xl mx-auto px-4 py-10'>
        <div className='my-4'>
            <span
            className='text-white flex items-center gap-2 font-semibold cursor-pointer'
            onClick={()=>router.push('/dashboard/orders')}
            >
                <ArrowLeftCircle size={20} />
                Повернутись до замовлень
            </span>
        </div>

        <h1 className='text-2xl font-bold text-gray-200 mb-4'>
            Замовлення #{order.id.slice(-6)}
        </h1>

        {/*Status Selector */}
        <div className='text-sm font-medium text-gray-300 mr-3 pb-4'>
            <label className='text-sm font-medium text-gray-300 mr-3'>
                Оновити статус замовлення
            </label>
            <select 
            value={order?.deliveryStatus}
            onChange={handleStatusChange}
            disabled={updating}
            className='border !bg-transparent text-gray-200 border-gray-300 rounded-md'
            >
                {statuses.map((status)=>{
                    const currentIndex=statuses.indexOf(order?.deliveryStatus);
                    const statusIndex=statuses.indexOf(status);

                    return(
                        <option className="bg-gray-800 text-gray-200" value={status} disabled={statusIndex<currentIndex} key={status}>
                            {status}
                        </option>
                    );
                })}
            </select>
        </div>

        {/*Delivery progress*/}
        <div className="mb-6">
  <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
    {statuses.map((step, idx) => {
      const current = step === order?.deliveryStatus;
      const passed = statuses.indexOf(order?.deliveryStatus) >= idx;
      return (
        <div
          key={step}
          className={`flex-1 text-left ${
            current
              ? "text-blue-600"
              : passed
              ? "text-green-600"
              : "text-gray-400"
          }`}
        >
          {step}
        </div>
      );
    })}
  </div>

  {/* Лінія + кружки */}
  <div className="relative flex items-center">
    {/* Сіра лінія на фоні */}
    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 -z-10"></div>

    {/* Прогресна лінія */}
    <div
      className="absolute top-1/2 left-0 h-1 bg-blue-500 -z-10 transition-all duration-500"
      style={{
        width: `${(statuses.indexOf(order?.deliveryStatus) / (statuses.length - 1)) * 100}%`,
      }}
    ></div>

    {/* Кружки */}
    {statuses.map((step, idx) => {
      const reached = idx <= statuses.indexOf(order?.deliveryStatus);
      return (
        <div key={step} className="flex-1 flex justify-center">
          <div
            className={`size-4 rounded-full border-2 ${
              reached ? "bg-blue-600 border-blue-600" : "bg-gray-300 border-gray-400"
            }`}
          ></div>
        </div>
      );
    })}
  </div>
</div>

        {/*Summary Information */}
        <div className='mb-6 space-y-1 text-sm text-gray-200'>
            <p>
                <span className='font-semibold'>Статус оплати:</span>{" "}
                <span className='text-green-600 font-medium'>{order?.status}</span>
            </p>
            <p>
                <span className='font-semibold'>Всього:</span>{" "}
                <span className=' font-medium'>{order?.total.toFixed(2)}</span>
            </p>

            {order.discountAmount > 0 && (
                <p>
                    <span className='font-semibold'>Знижка:</span>{" "}
                    <span className='text-green-400'>
                        -{order.discountAmount.toFixed(2)}(
                            {order.couponCode?.discountType==="percentage" 
                            ? `${order.couponCode?.discountValue}%` 
                            : `${order.couponCode?.discountValue} грн}`
                            }
                        )
                    </span>
                </p>
            )}


            {order.couponCode && (
                <p>
                    <span className='font-semibold'>Код купона:</span>{" "}
                    <span className='text-green-400'>{order.couponCode?.public_name}</span>
                </p>
            )}

            <p>
                <span className='font-semibold'>Дата:</span>{" "}
                {new Date(order?.createdAt).toLocaleDateString()}
            </p>
        </div>

        {/*Shipping address */}
        {order.shippingAddress && (
            <div className='mb-6 text-sm text-gray-300'>
                <h2 className='text-md font-semibold mb-2'>
                    Адреса доставки
                </h2>
                <p>{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.street}, {order.shippingAddress?.city},{" "} {order.shippingAddress?.zip}</p>
                <p>{order.shippingAddress?.country}</p>
            </div>
        )}

        {/*Order items */}
        <div>
            <h2 className='text-lg font-semibold text-gray-300 mb-4'>
                Товари в замовленні
            </h2>
            <div className='spaxe-y-4'>
                {order.items.map((item:any)=>(
                    <div key={item.productId}
                    className='border border-gray-200 rounded-md p-4 flex items-center gap-4'
                    >
                        <img 
                        src={item.product?.images[0]?.url || ""} 
                        alt={item.product?.title || "Product image"} 
                        className='size-16 object-cover rounded-md border border-gray-200'
                        />
                        <div className='flex-1'>
                            <p className='font-medium text-gray-200'>
                                {item.product?.title || "Товар без назви"}
                            </p>
                            <p className='text-sm text-gray-300'>
                                Кількість: {item.quantity}
                            </p>
                            {item.selectedOptions && 
                            Object.keys(item.selectedOptions).length > 0 && (
                                <div className='text-xs text-gray-400 mt-1'>
                                    {Object.entries(item.selectedOptions).map(([key,value]:[string,any])=>value &&(
                                        <span key={key}
                                        className='mr-3'
                                        >
                                            <span className='font-medium capitalize'>
                                                {key}:
                                            </span>{" "}
                                            {value}
                                        </span>
                                    ))}
                                </div>
                            )
                            }
                        </div>
                        <p className='text-sm font-semibold text-gray-200'>
                            {item?.price.toFixed(2)} грн
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Page;