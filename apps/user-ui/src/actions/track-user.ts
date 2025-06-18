"use server";

import {kafka} from "packages/utils/kafka";

const producer=kafka.producer();

export async function sendKafkaEvent(eventData:{
    userId?: string;
    productId?: string;
    shopId?: string;
    action: string;
    device?: string;
    country?: string;
    city?: string;
}){
    try {
        await producer.connect();
        await producer.send({
            topic: "users-events",
            messages: [
                {
                    value: JSON.stringify(eventData),
                },
            ],
        });
        await producer.disconnect();
    } catch (error) {
        console.log("Error sending Kafka event:", error);
    } finally{
        await producer.disconnect();
    }
}