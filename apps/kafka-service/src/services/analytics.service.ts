import prisma from "@packages/libs/prisma"

export const updateUserAnalytics= async (event: any) => {
    try {
        console.log(`[ANALYTICS SERVICE] Processing event for userId: ${event.userId}, action: ${event.action}`);

        const existingData=await prisma.userAnalytics.findUnique({
            where: {
                userId: event.userId,
            },
        });

        console.log('[ANALYTICS SERVICE] Found existing user data:', existingData ? `Record for user ${event.userId}` : 'null');

        let updatedActions:any=existingData?.actions || [];

        const actionExists= updatedActions.some((entry: any) => 
            entry.productId=== event.productId && entry.action===event.action);

        console.log("Action exists:", actionExists, "for user:", event.userId, "product:", event.productId, "action:", event.action);

        // Always store product_view for recommendations
        if(event.action === 'product_view') {
            updatedActions.push({
                productId: event?.productId,
                shopId: event.shopId,
                action: event?.action,
                timestamp: new Date(),
            });
        }

        else if(['add_to_cart', 'add_to_wishlist'].includes(event.action) && !actionExists) {
                updatedActions.push({
                    productId: event?.productId,
                    shopId: event.shopId,
                    action: event?.action,
                    timestamp: new Date(),
                });
        }

        // Remove add_to_cart if remove_from_cart is triggered

        else if(event.action === 'remove_from_cart' && actionExists) {
            updatedActions = updatedActions.filter((entry: any) => 
                !(
                    entry.productId === event.productId && 
                    entry.action === 'add_to_cart'
                ));
        }

        // Remove add_to_wishlist if remove_from_wishlist is triggered
        else if(event.action === 'remove_from_wishlist' && actionExists) {
            updatedActions = updatedActions.filter((entry: any) => 
                !(
                    entry.productId === event.productId && 
                    entry.action === 'add_to_wishlist'
                ));
        }

        // keep only the last 100 actions (prevent memory bloat)
        if(updatedActions.length > 100) {
            updatedActions.shift();
        }

        const extraFields:Record<string, any> = {};

        if(event.country) {
            extraFields.country = event.country;
        }

        if(event.city) {
            extraFields.city = event.city;
        }

        if(event.device) {
            extraFields.device = event.device;
        }

        console.log(`[ANALYTICS SERVICE] Preparing to upsert data for user ${event.userId}. Actions count: ${updatedActions.length}`);

        // Update or create user analytics record
        await prisma.userAnalytics.upsert({
            where: {
                userId: event.userId,
            },
            update: {
                lastVisited: new Date(),
                actions: updatedActions,
                ...extraFields,
            },
            create: {
                userId: event?.userId,
                lastVisited: new Date(),
                actions: updatedActions,
                ...extraFields,
            },
        });

        console.log(`[ANALYTICS SERVICE] Successfully upserted data for user ${event.userId}`);

        // Also update product analytics
        await updateProductAnalytics(event);        

    } catch (error) {
        console.error(`[ANALYTICS SERVICE] CRITICAL ERROR for user ${event.userId}:`, error);

    }
};

export const updateProductAnalytics = async (event: any) => {
    try {
        if (!event.productId) {
            return;
        }

        const updateFields:any = {};

        if(event.action === 'product_view') {
            updateFields.views = { increment: 1 };
        }
        if (event.action === 'add_to_cart') {
            updateFields.cartAdds = { increment: 1 };
        }
        if(event.action==='remove_from_cart') {
            updateFields.cartAdds = { decrement: 1 };
        }
        if(event.action === 'add_to_wishlist') {
            updateFields.wishListAdds = { increment: 1 };
        }
        if(event.action === 'remove_from_wishlist') {
            updateFields.wishListAdds = { decrement: 1 };
        }
        if(event.action === 'purchase') {
            updateFields.purchases = { increment: 1 };
        }

        // Update or create product analytics record
        await prisma.productAnalytics.upsert({
            where: {
                productId: event.productId,
            },
            update: {
                lastViewedAt: new Date(),
                ...updateFields,
            },
            create: {
                productId: event.productId,
                shopId: event.shopId || null,
                views: event.action === 'product_view' ? 1 : 0,
                cartAdds: event.action === 'add_to_cart' ? 1 : 0,
                wishListAdds: event.action === 'add_to_wishlist' ? 1 : 0,
                purchases: event.action === 'purchase' ? 1 : 0,
                lastViewedAt: new Date(),
            },
        });
        
    } catch (error) {
        console.log(`Error updating analytics for product ${event.productId}:`, error);
    }
}