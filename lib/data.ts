import type { User,  CalendarEvent} from '@/lib/definitions';
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
        };
    
        return user;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user');
    } 

}
export async function getEvents(): Promise<CalendarEvent[] | null> {
    try {
        const result = await sql(`SELECT * FROM events`)

        if (result.length === 0) return null;

        const events: CalendarEvent[] = result.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            startAt: event.startAt,
            endAt: event.endAt,
            storeId: event.storeId,
        }));

        return events;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch events');
    }
}
