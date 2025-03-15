import type { User, CalendarEvent, CalendarDisplayEvent, Store, Notification} from '@/lib/definitions';
import sql from "@/db/db";


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
            rrule: result[0].rrule,
            isrrule: result[0].isrrule

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




function date2String(date: Date) {
    if (!date) return
    const formattedDate = `${date?.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    return formattedDate;
}