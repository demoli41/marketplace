import {kafka} from "@packages/utils/kafka";
import { updateUserAnalytics } from "./services/analytics.service";

const consumer = kafka.consumer({ groupId: 'user-events-group' });

const eventQueue:any[] = [];

const processQueue = async () => {
    if(eventQueue.length === 0) {
        return;
    }

    console.log(`[QUEUE PROCESSOR] Starting to process batch of ${eventQueue.length} events.`);

    const events = [...eventQueue];
    eventQueue.length = 0;

    for (const event of events) {
        if(event.action==='shop_visit'){
        }

        const validActions=[
            "add_to_wishlist",
            "add_to_cart",
            "product_view",
            "remove_from_wishlist",
        ];
        if(!event.action || !validActions.includes(event.action)) {
            console.log(`[QUEUE PROCESSOR] Skipping event with invalid or missing action:`, event);
            continue;
        }
        try {
                await Promise.allSettled(
                events.map(event => updateUserAnalytics(event))
                );
        } catch (error) {
           console.log(`Error processing event ${event.id}:`, error); 
        }
    }
};

setInterval(processQueue, 3000);


export const consumeKafkaMessages = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'users-events', fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`[KAFKA CONSUMER] Received message from topic "${topic}", partition ${partition}`);
            if (!message.value) return;

            const eventString = message.value.toString();
            try {
                const event = JSON.parse(eventString);
                console.log('[KAFKA CONSUMER] Successfully parsed event:', event);
                eventQueue.push(event);
            } catch (parseError) {
                console.error('[KAFKA CONSUMER] FAILED TO PARSE JSON. Raw message:', eventString, 'Error:', parseError);
            }
        },
    });
};

consumeKafkaMessages().catch(console.error);
