import sql from "@/db/db";
import { users, stores, notifications, events } from "@/lib/placeholder-data";
import bcrypt from "bcrypt";

async function seedUsers() {
    await sql(`
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
            storeId VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            startAt TIME NOT NULL,
            endAt TIME NOT NULL,
            address TEXT NOT NULL
        );
    `);
    const insertedStores = await Promise.all(
        stores.map(
            (store) => sql(`
                INSERT INTO stores (id, storeId, name, startAt, endAt, address)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (id) DO NOTHING;
            `, [store.id, store.storeId ,store.name, store.startAt, store.endAt, store.address]),
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
            profileImageUrl TEXT,
            isEnabled BOOLEAN NOT NULL,
            storeId VARCHAR(255) NOT NULL
        );
    `);
    const insertedNotifications = await Promise.all(
        notifications.map(
            (notification) => sql(`
                INSERT INTO notifications (id, index, description, summary, profileImageUrl, isEnabled, storeId)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (id) DO NOTHING;
            `, [notification.id, notification.index, notification.description, notification.summary, notification.profileImageUrl, notification.isEnabled, notification.storeId]),
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
            storeId VARCHAR(255) NOT NULL
        );
    `);
    const insertedEvents = await Promise.all(
        events.map(
            (event) => sql(`
                INSERT INTO events (id, title, description, startAt, endAt, storeId)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (id) DO NOTHING;
            `, [event.id, event.title, event.description, event.startAt, event.endAt, event.storeId]),
        ),
    );
    return insertedEvents;

};

// App RouteのAPIではexport defaultを使わない。名前付き関数(GET, POST, PUT, DELETE)を明示的に定義してexportする。
export async function GET() {
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
    } catch (error: unknown) {
      await sql(`ROLLBACK`);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      console.error('Error seeding database:', error);
      return Response.json({ error: errorMessage }, { status: 500 });
    }
  }
