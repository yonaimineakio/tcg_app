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
            isAdmin: result[0].isAdmin,
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
            start: date2String(event.startat),
            end: date2String(event.endat),
            storeId: event.storeId,
        }));

        return events;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch events');
    }
}
function date2String(date: Date) {
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    return formattedDate;
}