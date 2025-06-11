import { Request, Response, NextFunction } from "express";
import { checkOtpRestrictions, handleForgotPassword, sendOtp, trackOtpRequests, validateRegistrationData, verifyForgotPasswordOtp, verifyOtp } from "../utils/auth.helper";
import bcrypt from "bcryptjs";
import prisma from "@packages/libs/prisma";
import { AuthError, ValidationError } from "@packages/error-handler"; import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookie";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-04-30.basil",
});


//Register a new user
export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validateRegistrationData(req.body, "user");
        const { name, email } = req.body;

        const existingUser = await prisma.users.findUnique({
            where: { email }
        });

        if (existingUser) {
            return next(new ValidationError("User already exists with this email!"));
        };

        await checkOtpRestrictions(email, next);
        await trackOtpRequests(email, next);
        await sendOtp(name, email, "user-activation-mail");

        res.status(200).json({
            message: "OTP sent successfully. Please check your email and verify your email.",
        });
    } catch (error) {
        return next(error);
    }
};

//Verify user with OTP
export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, password, name } = req.body;
        if (!email || !otp || !password || !name) {
            return next(new ValidationError("All fields are required."));
        }
        const existingUser = await prisma.users.findUnique({ where: { email } });

        if (existingUser) {
            return next(new ValidationError("User already exists with this email!"));
        };

        await verifyOtp(email, otp, next);
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
        });
    } catch (error) {
        return next(error);
    }
}

//Login user with email and password
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ValidationError("All fields are required."));
        }

        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) {
            return next(new AuthError("User doesn`t exist with this email!"));
        }

        //Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password!);

        if (!isMatch) {
            return next(new AuthError("Invalid email or password!"));
        }

        res.clearCookie("seller-access-token");
        res.clearCookie("seller-refresh-token");

        //Generate JWT token and refresh token
        const accessToken = jwt.sign({ id: user.id, role: "user" },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign({ id: user.id, role: "user" },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "7d" }
        );

        // store refresh and access token in an httpOnly secure cookie

        setCookie(res, "refresh_token", refreshToken);
        setCookie(res, "access_token", accessToken);

        res.status(200).json({
            message: "User logged in successfully.",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        })


    } catch (error) {
        return next(error);
    }
}

//Refresh user token
export const refreshToken = async (req: any, res: Response, next: NextFunction) => {
    try {
        const refreshToken =
            req.cookies["refresh_token"] ||
            req.cookies["seller-refresh-token"] ||
            req.headers.authorization?.split(" ")[1];

        if (!refreshToken) {
            return new ValidationError("Unauthorized. Refresh token not found.");
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string) as { id: string, role: string };

        if (!decoded || !decoded.id || !decoded.role) {
            return new JsonWebTokenError("Forbidden. Invalid refresh token.");
        }

        let account;

        if(decoded.role==="user"){
        account = await prisma.users.findUnique({
            where: { id: decoded.id },
        });
        } else if(decoded.role==="seller"){
            account = await prisma.sellers.findUnique({
                where: { id: decoded.id },
                include:{shop:true},
            });
        }

        if (!account) {
            return new AuthError("User/Seller not found.");
        }

        const newAccessToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "15m" }
        );

        if (decoded.role === "user") {
            setCookie(res, "access_token", newAccessToken);
        } else if (decoded.role === "seller") {
            setCookie(res, "seller-access-token", newAccessToken);
        };

        req.role=decoded.role;

        return res.status(200).json({
            success: true,
        })

    } catch (error) {
        return next(error);
    }
}

//Get logged in user
export const getUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

//Forgot password
export const userForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    await handleForgotPassword(req, res, next, "user");
};

//Verify OTP for forgot password
export const verifyUserForgotPasswordOtp = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        await verifyForgotPasswordOtp(req, res, next);


    } catch (error) {
        return next(error);
    }
};

//Reset user password
export const resetUserPassword = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return next(new ValidationError("Email and new password are required."));
        }

        const user = await prisma.users.findUnique({
            where: { email }
        })

        if (!user) {
            return next(new ValidationError("User not found."));
        }

        //compare the new password with the old password
        const isSamePassword = await bcrypt.compare(newPassword, user.password!);

        if (isSamePassword) {
            return next(new ValidationError("New password cannot be same as old password."));
        };

        //HAsh the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where: { email },
            data: {
                password: hashedPassword,
            },
        });

        res.status(200).json({
            message: "Password reset successfully. You can now login with your new password.",
        });

    } catch (error) {
        return next(error);
    }
};

//Register a new seller
export const registerSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validateRegistrationData(req.body, "seller");
        const { name, email } = req.body;

        const existingSeller = await prisma.sellers.findUnique({
            where: { email },
        });

        if (existingSeller) {
            return next(new ValidationError("Продавець вже існує з цим email!"));
        };

        await checkOtpRestrictions(email, next);
        await trackOtpRequests(email, next);
        await sendOtp(name, email, "seller-activation");

        res.status(200).json({
            message: "OTP відправлено успішно. Перевірте свою електронну пошту та підтвердіть свій email.",
        })

    } catch (error) {
        return next(error);
    }
};

//Verify seller with OTP
export const verifySeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, password, name, phone_number, country } = req.body;

        if (!email || !otp || !password || !name || !phone_number || !country) {
            return next(new ValidationError("Всі поля необхідні."));
        }

        const existingSeller = await prisma.sellers.findUnique({
            where: { email },
        });

        if (existingSeller) {
            return next(new ValidationError("Продавець вже існує з цим email!"));
        };

        await verifyOtp(email, otp, next);
        const hashedPassword = await bcrypt.hash(password, 10);

        const seller = await prisma.sellers.create({
            data: {
                name,
                email,
                password: hashedPassword,
                country,
                phone_number,
            },
        });

        res.status(201).json({
            seller, message: "Продавець успішно зареєстрований.",
        });

    } catch (error) {
        return next(error);
    }
};

//Create a new shop
export const createShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, bio, address, opening_hours, website, category, sellerId } = req.body;

        if (!name || !bio || !address || !sellerId || !opening_hours || !category) {
            return next(new ValidationError("Всі поля необхідні."));
        }

        const shopData: any = {
            name,
            bio,
            address,
            opening_hours,
            category,
            sellerId,
        };

        if (website && website.trim() !== "") {
            shopData.website = website;
        }

        const shop = await prisma.shops.create({
            data: shopData,
        });

        res.status(201).json({
            success: true,
            shop,
        });

    } catch (error) {
        return next(error);
    }
};

//Create stripe connect account for seller
export const createStripeConnectLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sellerId } = req.body;

        if (!sellerId) {
            return next(new ValidationError("Seller ID is required."));
        }

        const seller = await prisma.sellers.findUnique({
            where: { id: sellerId },
        });

        if (!seller) {
            return next(new ValidationError("Seller not found."));
        }

        console.log("Received sellerId:", sellerId);
        console.log("Found seller:", seller);


        let account;
        try {
            account = await stripe.accounts.create({
                type: "express",
                email: seller?.email,
                country: "US",
                capabilities: {
                    card_payments: {
                        requested: true,
                    },
                    transfers: {
                        requested: true,
                    },
                },
            });
        } catch (err) {
            console.error("Stripe account create error:", err);
            return next(err);
        }

        console.log("Seller account created:", account);

        await prisma.sellers.update({
            where: { id: sellerId },
            data: {
                stripeId: account.id,
            },
        });

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `http://localhost:3000/success`,
            return_url: `http://localhost:3000/success`,
            type: "account_onboarding",
        });

        res.json({
            url: accountLink.url,
        })

    } catch (error) {
        console.error("Stripe registration error:", error);
        return next(error);
    }
};

//Login seller
export const loginSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ValidationError("All fields are required."));
        }

        const seller = await prisma.sellers.findUnique({
            where: { email },
        });

        if (!seller) {
            return next(new ValidationError("Invalid email or password!"));
        }

        //Check if password is correct
        const isMatch = await bcrypt.compare(password, seller.password!);

        if (!isMatch) {
            return next(new ValidationError("Invalid email or password!"));
        }

        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        //Generate JWT token and refresh token
        const accessToken = jwt.sign({ id: seller.id, role: "seller" },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign({ id: seller.id, role: "seller" },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "7d" }
        );

        // store refresh and access token in an httpOnly secure cookie

        setCookie(res, "seller-refresh-token", refreshToken);
        setCookie(res, "seller-access-token", accessToken);

        res.status(200).json({
            message: "Seller logged in successfully.",
            seller: {
                id: seller.id,
                email: seller.email,
                name: seller.name,
            },
        })


    } catch (error) {
        return next(error);
    }
};

//Get logged in seller
export const getSeller = async (req: any, res: Response, next: NextFunction) => {
    try {
        const seller = req.seller;
        res.status(200).json({
            success: true,
            seller,
        });
    } catch (error) {
        next(error);
    }
};