import ProductDetails from 'apps/user-ui/src/shared/modules/product/product-details';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { Metadata } from 'next';
import React,{cache} from 'react'

const fetchProductDetails=cache(async (slug: string) => {
    const response=await axiosInstance.get(`/product/api/get-product/${slug}`);
    return response.data.product;
});

export async function generateMetadata({params}:{params:{slug:string}}):Promise<Metadata> {
    const {slug}=await params;

    const product = await fetchProductDetails(slug);
    return {
        title: `${product?.title} - Marketplace`,
        description: product?.short_description || 'Product details page',
        openGraph:{
            title: product?.title,
            description: product?.short_description || 'Product details page',
            images: [product?.images?.[0]?.url || ''],
            type: 'website',
        },
    };
}

const Page = async ({params}:{params:{slug:string}}) => {

    const {slug}=await params;

    const productDetails=await fetchProductDetails(slug);

  return <ProductDetails productDetails={productDetails} />;
};

export default Page;