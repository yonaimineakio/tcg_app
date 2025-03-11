import sql from "@/db/db";
import { users, stores, notifications, events } from "@/lib/placeholder-data";
import bcrypt from "bcrypt";

async function seedUsers() {
    await sql(`
        CREATE TABLE IF NOT EXISTS users (
            id PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );
    `);
    const insertedUsers = await Promise.all(
        users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.hashedPassword, 10);
            return sql(`
                INSERT INTO users (id, name, email, password)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (id) DO NOTHING;
            `, [user.id, user.name, user.email, hashedPassword]);
        }),
    );
    return insertedUsers;

};
async function seedStores() {
    await sql(`
        CREATE TABLE IF NOT EXISTS stores (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            store_id VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            startAt TIME NOT NULL,
            endAt TIME NOT NULL,
            address TEXT NOT NULL
        );
    `);
    const insertedStores = await Promise.all(
        stores.map(
            (store) => sql(`
                INSERT INTO stores (id, name, startAt, endAt, address)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (id) DO NOTHING;
            `, [store.id, store.name, store.startAt, store.endAt, store.address]),
        ),
    );
    return insertedStores;

};
async function seedNotifications() {
    await sql(`
        CREATE TABLE IF NOT EXISTS notifications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            index INT NOT NULL,
            description TEXT NOT NULL,
            summary TEXT NOT NULL,
            profileimage_url TEXT,
            isEnabled BOOLEAN NOT NULL,
            store_id VARCHAR(255) NOT NULL
        );
    `);
    const insertedNotifications = await Promise.all(
        notifications.map(
            (notification) => sql(`
                INSERT INTO notifications (id, index, description, summary, profileimage_url, isEnabled, store_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (id) DO NOTHING;
            `, [notification.id, notification.index, notification.description, notification.summary, notification.profileimage_url, notification.isEnabled, notification.store_id]),
        ),
    );
    return insertedNotifications;

};
async function seedEvents() {
    await sql(`
        CREATE TABLE IF NOT EXISTS events (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            startAt TIMESTAMP NOT NULL,
            endAt TIMESTAMP NOT NULL,
            store_id VARCHAR(255) NOT NULL
        );
    `);
    const insertedEvents = await Promise.all(
        events.map(
            (event) => sql(`
                INSERT INTO events (id, title, description, startAt, endAt, store_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (id) DO NOTHING;
            `, [event.id, event.title, event.description, event.startAt, event.endAt, event.store_id]),
        ),
    );
    return insertedEvents;

};


export default async function GET() {
    // return Response.json({
    //   message:
    //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
    // });
    try {
      await sql(`BEGIN`);
        await seedUsers();
        await seedStores();
        await seedNotifications();
        await seedEvents();
      await sql(`COMMIT`);

      return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
      await sql(`ROLLBACK`);
      return Response.json({ error }, { status: 500 });
    }
  }
