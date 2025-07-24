import { AuthError, NotFoundError, ValidationError } from "@packages/error-handler";
import { imagekit } from "@packages/libs/imagekit";
import prisma from "@packages/libs/prisma";
import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";






// get product categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await prisma.site_config.findFirst();

        if (!config) {
            return res.status(404).json({ message: "Categories not found" });
        }

        return res.status(200).json({
            categories: config.categories,
            subCategories: config.subCategories,
        });

    } catch (error) {
        return next(error);
    }
};

// Crete discount codes
export const createDiscountCodes = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { public_name, discountType, discountValue, discountCode } = req.body;

        const isDiscountCodeExist = await prisma.discount_codes.findUnique({
            where: {
                discountCode: discountCode,
            },
        });

        if (isDiscountCodeExist) {
            return next(
                new ValidationError(
                    "Discount code already exists"
                )
            );
        }

        const discount_code = await prisma.discount_codes.create({
            data: {
                public_name,
                discountType,
                discountValue: parseFloat(discountValue),
                discountCode,
                sellerId: req.seller.id,
            },
        });

        res.status(201).json({
            success: true,
            discount_code,
        });

    } catch (error) {
        next(error);
    }
};

// Get discount codes
export const getDiscountCodes = async (req: any, res: Response, next: NextFunction) => {
    try {
        const discount_codes = await prisma.discount_codes.findMany({
            where: {
                sellerId: req.seller.id,
            },
        });

        res.status(200).json({
            success: true,
            discount_codes,
        });
    } catch (error) {
        next(error);
    }
};

// Delete discount code
export const deleteDiscountCode = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const sellerId = req.seller?.id;

        const discountCode = await prisma.discount_codes.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                sellerId: true,
            },
        });

        if (!discountCode) {
            return next(new NotFoundError("Discount code not found"));
        }

        if (discountCode.sellerId !== sellerId) {
            return next(new ValidationError("You are not authorized to delete this discount code"));
        }

        await prisma.discount_codes.delete({
            where: { id }
        });

        res.status(200).json({
            message: "Discount code deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Upload product image
export const uploadProductImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fileName } = req.body;

        const response = await imagekit.upload({
            file: fileName,
            fileName: `product-${Date.now()}.jpg`,
            folder: "/products",
        });

        res.status(201).json({
            file_url: response.url,
            fileId: response.fileId,
        });
    } catch (error:any) {
        console.error("Create product error:", error.message, error);
        res.status(500).json({ error: "Internal server error", detail: error.message });
    }
};

// Delete product image
export const deleteProductImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fileId } = req.body;

        const response = await imagekit.deleteFile(fileId);

        res.status(200).json({
            success: true,
            response,
        });
    } catch (error) {
        next(error);
    }
};

// Create product
export const createProduct = async (req: any, res: Response, next: NextFunction) => {
    try {
        const {
            title,
            short_description,
            detailed_description,
            warranty,
            custom_specifications,
            slug,
            tags,
            cash_on_delivery,
            brand,
            video_url,
            category,
            colors = [],
            sizes = [],
            discountCodes,
            stock,
            sale_price,
            regular_price,
            subCategory,
            customProperties,
            images = [],
        } = req.body;

        if (!title ||
            !slug ||
            !short_description ||
            !category ||
            !subCategory ||
            !sale_price ||
            !images ||
            !tags ||
            !stock ||
            !regular_price
        ) {
            return next(new ValidationError("Please fill all the required fields"));
        }
        if (!req.seller.id) {
            return next(new AuthError("Seller not found"));
        }

        const slugChecking = await prisma.products.findUnique({
            where: {
                slug,
            },
        });

        if (slugChecking) {
            return next(new ValidationError("Slug already exists"));
        }

        const newProduct = await prisma.products.create({
            data: {
                title,
                short_description,
                detailed_description,
                warranty,
                cashOnDelivery: cash_on_delivery,
                slug,
                shopId: req.seller?.shop?.id!,
                tags: Array.isArray(tags) ? tags : tags.split(","),
                brand,
                video_url,
                category,
                subCategory,
                colors: colors || [],
                discount_codes: discountCodes.map((codeId: string) => codeId),
                sizes: sizes || [],
                stock: parseInt(stock),
                sale_price: parseFloat(sale_price),
                regular_price: parseFloat(regular_price),
                custom_properties: customProperties || {},
                custom_specifications: custom_specifications || {},
                images: {
                    create: images
                        .filter((img: any) => img && img.fileId && img.file_url)
                        .map((img: any) => ({
                            file_id: img.fileId,
                            url: img.file_url,
                        })),
                }
            },
            include: { images: true },
        });

        res.status(201).json({
            success: true,
            newProduct,
        });

    } catch (error:any) {
        console.error("Create product error:", error.message, error);
        res.status(500).json({ error: "Internal server error", detail: error.message });
    }
}

// Get all products
export const getShopProducts = async (req: any, res: Response, next: NextFunction) => {
    try {
        const products = await prisma.products.findMany({
            where: {
                shopId: req?.seller?.shop?.id,
            },
            include: {
                images: true,
            },
        });

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        next(error);
    }
};

// Delete product
export const deleteProduct = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const sellerId = req.seller?.shop?.id;

        const product = await prisma.products.findUnique({
            where: {
                id: productId,
            },
            select: {
                id: true,
                shopId: true,
                isDeleted: true,
            },
        });

        if (!product) {
            return next(new ValidationError("Product not found"));
        }

        if (product.shopId !== sellerId) {
            return next(new ValidationError("You are not authorized to delete this product"));
        }

        if (product.isDeleted) {
            return next(new ValidationError("Product is already deleted"));
        }

        const deletedProduct = await prisma.products.update({
            where: { id: productId },
            data: {
                isDeleted: true,
                deletedAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Soft delete with 24 hours retention
            },
        });

        return res.status(200).json({
            message:
                "Product deleted successfully. It will be permanently removed after 24 hours.",
            product: deletedProduct,
        });

    } catch (error) {
        next(error);
    }
};

// Product restore
export const restoreProduct = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const sellerId = req.seller?.shop?.id;

        const product = await prisma.products.findUnique({
            where: {
                id: productId,
            },
            select: {
                id: true,
                shopId: true,
                isDeleted: true,
            },
        });

        if (!product) {
            return next(new ValidationError("Product not found"));
        }

        if (product.shopId !== sellerId) {
            return next(new ValidationError("You are not authorized to restore this product"));
        }

        if (!product.isDeleted) {
            return next(new ValidationError("Product is not deleted"));
        }

        await prisma.products.update({
            where: { id: productId },
            data: {
                isDeleted: false,
                deletedAt: null, // Clear the deletedAt field
            },
        });


        return res.status(200).json({
            message: "Product restored successfully.",
        });

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while restoring the product.",
            error,
        });
    }
};

// Get All Products
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;
        const type = req.query.type;

        const baseFilter = {
            isDeleted: false, 
            // OR: {
            //     starting_date: null,
            //     ending_date: null,
            // },
           // OR: [
               // {
                   // starting_date: null,

              //  },{
                    //ending_date: null,
              //  },
          //  ],
        };

        const orderBy:Prisma.productsOrderByWithRelationInput = 
            type==="latest"
            ?{createdAt: "desc" as Prisma.SortOrder}
            :{totalSales: "desc" as Prisma.SortOrder};

            const [products,total,top10Products]= await Promise.all([
                prisma.products.findMany({
                    skip,
                    take: limit,
                    include: {
                        images: true,
                        Shop:true,
                    },
                    where:baseFilter,
                    //TODO: Fix the filter to include only products that are not deleted
                    orderBy,
                }),

                prisma.products.count({where: baseFilter}),
                prisma.products.findMany({
                    take: 10,
                    where: baseFilter,
                    orderBy,
                }),
            ]);

            res.status(200).json({
                products,
                top10By: type === "latest" ? "latest" : "topSales",
                top10Products,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            });
        

    } catch (error) {
        next(error);
    }
}

// Get product details by slug
export const getProductDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await prisma.products.findUnique({
            where: {
                slug: req.params.slug!,
            },
            include: {
                images: true,
                Shop: true,
            },
        });

        if (!product) {
            return next(new ValidationError("Product not found"));
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        return next(error);
    }
};
