import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import redis from "@packages/libs/redis";
import { sendEmail } from "./sendEmail";
import { NextFunction, Request,Response } from "express";
import prisma from "@packages/libs/prisma";

const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const validateRegistrationData=(data:any,userType:"user" | "seller")=>{
    const {name,email,password,phone_number,country}=data;

    if(
        !name || 
        !email || 
        !password || 
        (userType==="seller" && (!phone_number || !country))
    ){
        throw new ValidationError(`Missing required fields`);
    }

    if(!emailRegex.test(email)){
        throw new ValidationError(`Invalid email format`);
    }

};

export const checkOtpRestrictions=async(
    email:string,
    next:NextFunction
)=>{
    if(await redis.get(`otp_lock:${email}`)){
        return next(new ValidationError("Account is locked due to too many OTP requests. Please try again later.")
    );
    }
    if(await redis.get(`otp_spam_lock:${email}`)){
        return next(new ValidationError("Too many OTP requests. Please wait 1hour bedore requesting again.")
    );
    }
    if(await redis.get(`otp_cooldown:${email}`)){
        return next(new ValidationError("Please wait 1 minute before requesting another OTP.")
    );
    }
};

export const trackOtpRequests=async(email:string,next:NextFunction)=>{
    const otpRequestKey=`otp_request_count:${email}`;
    let otpRequests=parseInt((await redis.get(otpRequestKey)) || "0");

    if(otpRequests>=2){
        await redis.set(`otp_spam_lock:${email}`,"locked","EX",3600);
        return next(new ValidationError("Account is locked for 1 hour due to too many OTP requests. Please try again later.")
    );
    }

    await redis.set(otpRequestKey,otpRequests+1,"EX",3600);
};

export const sendOtp=async(name:string,email:string,template:string)=>{
    const otp=crypto.randomInt(1000,9999).toString();
    await sendEmail(email,"verify Your Email",template,{
        name,otp});
    await redis.set(`otp:${email}`,otp, "EX",300);
    await redis.set(`otp_cooldown:${email}`,"true", "EX",60);
};

export const verifyOtp=async(email:string,otp:string,next:NextFunction)=>{
    const storedOtp=await redis.get(`otp:${email}`);
    if(!storedOtp){
        throw new ValidationError("OTP expired or invalid.");
    }
    
    const failedAttemptsKey=`otp_attempts:${email}`;
    const failedAttempts=parseInt((await redis.get(failedAttemptsKey)) || "0");

    if(storedOtp !==otp){
        if(failedAttempts>=2){
            await redis.set(`otp_lock:${email}`,"locked","EX",1800);
            await redis.del(`otp:${email}`,failedAttemptsKey);

            throw new ValidationError("Account is locked for 30 minutes due to too many failed OTP attempts. Please try again later.");
        }   
        await redis.set(failedAttemptsKey,failedAttempts+1,"EX",300);
        throw new ValidationError(`Incorrect OTP. Please try again. ${2-failedAttempts} attempts left.`);
    }

    await redis.del(`otp:${email}`,failedAttemptsKey);
};

export const handleForgotPassword=async(
    req:Request,
    res:Response,
    next:NextFunction,
    userType:"user" | "seller"
)=>{
    try {
        const {email}=req.body;
        if(!email){
            return next(new ValidationError("Email is required."));
        }

        //Find user or seller in database
        const user=
        userType==="user" 
        ? await prisma.users.findUnique({where:{email}}) 
        : await prisma.sellers.findUnique({where:{email}});

        if(!user){
            return next(new ValidationError(`${userType} not found.`));
        }

        //Check if user is locked OTP
        await checkOtpRestrictions(email,next);
        await trackOtpRequests(email,next);

        //Generate OTP and send email
        await sendOtp(user.name,email,userType==="user" ? 
            'forgot-password-user-mail' : 
            'forgot-password-seller-mail');

        res.status(200).json({
            message:`OTP sent successfully to ${email}. Please check your email.`,
        });
    } catch (error) {
        next(error);
    }
}

export const verifyForgotPasswordOtp=async(
    req: Request, 
    res: Response,
    next:NextFunction,
)=>{
    try {
        const {email,otp}=req.body;

        if(!email || !otp){
            return next(new ValidationError("Email and OTP are required."));
        }

        await verifyOtp(email,otp,next);

        res.status(200).json({
            message:`OTP verified successfully. You can now reset your password.`,
        });
    } catch (error) {
        return next(error);      
    }
};