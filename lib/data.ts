import type { User, CalendarEvent, CalendarDisplayEvent, CalendarDisplayEventsWithStoreInfo ,Store, Notification, UserAccount, UserEventParticipant} from '@/lib/definitions';
import sql from "@/db/db";


export async function upsertParticipantEvent(participant: UserEventParticipant): Promise<void> {
    try {
        await sql(
            `INSERT INTO events_participants (event_id, provider_account_id, status) VALUES ($1, $2, $3)
            ON CONFLICT (event_id, provider_account_id) DO UPDATE SET status = $3
            `,
            [participant.event_id, participant.provider_account_id, participant.status]
        )
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create participant');
    }
}

export async function getParticipantUserAccounts(event_id: string): Promise<UserAccount[] | null> {
    try {
        const result = await sql(
            `
            SELECT 
                user_accounts.id,
                user_accounts.name,
                user_accounts.image_url,
                user_accounts.provider,
                user_accounts.provider_account_id
            FROM 
                user_accounts
            WHERE
             user_accounts.provider_account_id IN (
                SELECT 
                    provider_account_id 
                FROM 
                    events_participants
                WHERE
                    event_id = $1 AND
                    status = 'interested'
            )
            `
            , [event_id]
        )
        if (result.length === 0) return null;
        return result.map(user => ({
            id: user.id,
            name: user.name,
            image_url: user.image_url,
            provider: user.provider,
            provider_account_id: user.provider_account_id
        }));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get participant');
    }
}

export async function createUserAccount(userAccount: UserAccount): Promise<void> {
    try {
        await sql(`INSERT INTO user_accounts (id, name, image_url, provider, provider_account_id) VALUES ($1, $2, $3, $4, $5)`, [userAccount.id, userAccount.name, userAccount.image_url, userAccount.provider, userAccount.provider_account_id])
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create user account');
    }
}

export async function getUserAccount(provider_account_id: string, provider: string): Promise<UserAccount | null> {
    try {
        const result = await sql(`SELECT * FROM user_accounts WHERE provider_account_id = $1 AND provider = $2`, [provider_account_id, provider])
        if (result.length === 0) return null;
        const userAccount: UserAccount = {
            id: result[0].id,
            name: result[0].name,
            image_url: result[0].image_url,
            provider: result[0].provider,
            provider_account_id: result[0].provider_account_id
        };
        return userAccount;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get user account');
    }
}

export async function getUser(email: string): Promise<User | null> {
    try {
        const result = await sql(`SELECT * FROM users WHERE email = $1`, [email])

        if (result.length === 0) return null;
    
        const user: User = {
            id: result[0].id,
            name: result[0].name,
            email: result[0].email,
            hashedPassword: result[0].password,
            isAdmin: result[0].isAdmin,
        };
    
        return user;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user');
    } 

}

export async function isSignedUpBefore(provider_account_id: string, provider: string): Promise<boolean> {
    try {
        const result = await sql(`SELECT * FROM user_accounts WHERE provider_account_id = $1 AND provider = $2`, [provider_account_id, provider])
        return result.length > 0;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to check if user is signed up before');
    }
}

export async function getStores(): Promise<Store[] | null> {
    try {
        const result = await sql(`SELECT * FROM stores`)

        if (result.length === 0) return null;

        const stores: Store[] = result.map(store => ({
            id: store.id,
            name: store.name,
            description: store.description,
            business_start: store.business_start,
            business_end: store.business_end,
            address: store.address,
            image_url: store.image_url
        }));

        return stores;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch stores');
    }
}

export async function getStore(store_id: string): Promise<Store | null> { 
    try {
        const result = await sql(`SELECT * FROM stores WHERE id = $1`, [store_id])

        if (result.length === 0) return null;

        const store: Store = {
            id: result[0].id,
            name: result[0].name,
            description: result[0].description,
            business_start: result[0].business_start,
            business_end: result[0].business_end,
            address: result[0].address,
            image_url: result[0].image_url
        };

        return store;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch store');
    }
}

export async function getEvents(): Promise<CalendarDisplayEvent[] | null> {

    try {
        const result = await sql(`SELECT * FROM events`)

        if (result.length === 0) return null;

        const events: CalendarDisplayEvent[] = result.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            start: date2String(event.startat),
            end: date2String(event.endat),
            store_id: event.store_id,
            rrule: event.rrule 
        }));

        return events;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch events');
    }
}

export async function getEventsWithStoreName(): Promise<CalendarDisplayEventsWithStoreInfo[] | null> {
    try {
        const result = await sql(
            `SELECT events.*, stores.name as store_name, stores.image_url as store_image  FROM events
             JOIN stores ON events.store_id::uuid = stores.id
            `)

        if (result.length === 0) return null;

        const events: CalendarDisplayEventsWithStoreInfo[] = result.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            start: date2String(event.startat),
            end: date2String(event.endat),
            store_id: event.store_id,
            rrule: event.rrule,
            store_name: event.store_name,
            store_image: event.store_image
        }));

        return events;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch events');
    }
}

export async function getEventByDayWithStoreName(date: string): Promise<CalendarDisplayEventsWithStoreInfo[] | null> {
    try {
        const result = await sql(`SELECT events.*, stores.name as store_name, stores.image_url as store_image FROM events
                                  JOIN stores ON events.store_id::uuid = stores.id
                                  WHERE CAST(events.startat AS DATE) = $1`, [date])

        if (result.length === 0) return null;

        const events: CalendarDisplayEventsWithStoreInfo[] = result.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            start: date2String(event.startat),
            end: date2String(event.endat),
            store_id: event.store_id,
            rrule: event.rrule,
            store_name: event.store_name,
            store_image: event.store_image
        }));
        console.log(events);

        return events;
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to fetch event');
    }
}

export async function getEvent(eventId: string): Promise<CalendarEvent | null> {
    try {
        const result = await sql(`SELECT * FROM events WHERE id = $1`, [eventId])

        if (result.length === 0) return null;

        const event: CalendarEvent = {
            id: result[0].id,
            title: result[0].title,
            description: result[0].description,
            startAt: date2String(result[0].startat),
            endAt: date2String(result[0].endat),
            store_id: result[0].store_id,
            isrrule: result[0].isrrule,
            rruleid: result[0].rruleid

        };

        return event;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch event');
    }
}
export async function getEventsByStore(store_id: string): Promise<CalendarEvent[] | null> {
    try {
        const result = await sql(`SELECT * FROM events WHERE store_id = $1`, [store_id])

        if (result.length === 0) return null;

        const events: CalendarEvent[] = result.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            startAt: date2String(event.startat),
            endAt: date2String(event.endat),
            store_id: event.store_id,
            isrrule: event.isrrule
        }));

        return events;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch events');
    }
}

export async function getNotificationsByStore(store_id: string): Promise<Notification[] | null> {
    try {
        const result = await sql(`SELECT * FROM notifications WHERE store_id = $1`, [store_id])

        if (result.length === 0) return null;

        const notifications: Notification[] = result.map(notification => ({
            id: notification.id,
            index: notification.index,
            description: notification.description,
            summary: notification.summary,
            profile_image_url: notification.profile_image_url,
            notify: notification.notify,
            store_id: notification.store_id,
        }));

        return notifications;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch notifications');
    }
}

export async function getNotification(notificationId: string): Promise<Notification | null> {
    try {
        const result = await sql(`SELECT * FROM notifications WHERE id = $1`, [notificationId])

        if (result.length === 0) return null;

        const notification: Notification = {
            id: result[0].id,
            index: result[0].index,
            description: result[0].description,
            summary: result[0].summary,
            profile_image_url: result[0].profile_image_url,
            notify: result[0].notify,
            store_id: result[0].store_id
        };

        return notification;
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to fetch notification');
    }
}


// export async function getEventsByRruleId(rruleid: string): Promise<CalendarEvent[] | null> {
//     try {
//         const result = await sql(`SELECT * FROM events WHERE rruleid = $1`, [rruleid])

//         if (result.length === 0) return null;

//         const startEvent : CalendarEvent = {
//             id: result[0].id,
//             title: result[0].title,
//             description: result[0].description,
//             startAt: date2String(result[0].startat),
//             endAt: date2String(result[0].endat),
//             store_id: result[0].store_id,
//             isrrule: result[0].isrrule
//         }

//         const lastEvent : CalendarEvent = {
//             id: result[result.length - 1].id,
//             title: result[result.length - 1].title,
//             description: result[result.length - 1].description,
//             startAt: date2String(result[result.length - 1].startat),
//             endAt: date2String(result[result.length - 1].endat),
//             store_id: result[result.length - 1].store_id,
//             isrrule: result[result.length - 1].isrrule
//         }

//         return [startEvent, lastEvent];


//     } catch (error) {
//         console.error(error);
//         throw new Error('Failed to fetch events');
//     }

// }


// export async function getRruledEventsByStore(store_id: string): Promise<{id: string, title: string}[] | null> {
    
//     const reuslts = await sql(`SELECT * FROM events WHERE store_id = $1 AND isrrule = TRUE`, [store_id])
//     const uniqueRruledEventsMap = new Map<string,  { id: string; title: string }>();
//     reuslts.forEach((event) => {
//         if(!uniqueRruledEventsMap.has(event.rruleid)){
//             uniqueRruledEventsMap.set(event.rruleid, { id: event.rruleid, title: event.title });
//         }
        
//     });

//     const uniqueRruledEvents = Array.from(uniqueRruledEventsMap.values());
//     console.log(uniqueRruledEvents);
//     return uniqueRruledEvents;

// }



function date2String(date: Date) {
    // if (!date) return
    const formattedDate = `${date?.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    return formattedDate;
}