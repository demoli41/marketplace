import Prisma from "@prisma/client";



const prisma = new Prisma.PrismaClient();

const initializeSiteConfig = async () => {
    try {
        const existingConfig = await prisma.site_config.findFirst();

        if (!existingConfig) {
            await prisma.site_config.create({
                data: {
                    categories: [
                        "General",
                        "Technology",
                        "Health",
                        "Science",
                        "Sports",
                        "Entertainment",
                        "Business",
                        "Lifestyle",
                        "Travel",
                        "Education",
                        "Food",
                        "Fashion",
                        "Art",
                        "Music",
                        "Finance",
                    ],
                    subCategories: {
                        "General": ["Trending", "Best Sellers", "New Arrivals"],
                        "Technology": ["Smartphones", "Laptops", "Accessories", "Wearables", "Gaming", "Cameras"],
                        "Health": ["Supplements", "Fitness Equipment", "Wellness", "Medical Devices", "Personal Care"],
                        "Science": ["Lab Equipment", "Scientific Tools", "Books", "Microscopes"],
                        "Sports": ["Gym Equipment", "Outdoor Sports", "Team Sports", "Fitness Trackers"],
                        "Entertainment": ["Movies", "Board Games", "Gaming Consoles", "Collectibles"],
                        "Business": ["Office Supplies", "Software", "Business Books", "Stationery"],
                        "Lifestyle": ["Home Decor", "Gadgets", "Personal Development", "Journals"],
                        "Travel": ["Luggage", "Travel Accessories", "Camping & Hiking", "Travel Guides"],
                        "Education": ["Books", "Online Courses", "Learning Kits", "Stationery"],
                        "Food": ["Snacks", "Beverages", "Gourmet", "Organic", "Meal Kits"],
                        "Fashion": ["Men", "Women", "Kids", "Footwear", "Accessories"],
                        "Art": ["Paintings", "Sculptures", "Craft Supplies", "Prints"],
                        "Music": ["Instruments", "Vinyl", "Speakers", "Music Accessories"],
                        "Finance": ["Books", "Software", "Budgeting Tools", "Investment Resources"]
                    },
                }
            });
        }
    } catch (error) {
        console.error("Error initializing site config:", error);
    }
};

export default initializeSiteConfig;