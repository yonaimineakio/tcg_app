import { v4 as uuidv4 } from 'uuid';

export const users = [
    {
      id: uuidv4(),
      name: 'Tarou',
      email: 'Tarou@nextmail.com',
      hashedPassword: 'hashedpassword123',
    },
    {
      id: uuidv4(),
      name: 'Hana',
      email: 'Hana@nextmail.com',
      hashedPassword: 'hashedpassword456',
    },
  ];
  
  const stores = [
    {
      id: uuidv4(),
      store_id : 'store1',
      name: 'Central Coffee',
      startAt: '08:00:00',
      endAt: '20:00:00',
      address: '123 Coffee St, Coffee City',
    },
    {
      id: uuidv4(),
      store_id : 'store2',
      name: 'Tech Lounge',
      startAt: '09:00:00',
      endAt: '22:00:00',
      address: '456 Tech Ave, Tech Valley',
    },
  ];
  
  const notifications = [
    {
      id: uuidv4(),
      index: 1,
      description: 'Weekly promo campaign',
      summary: 'Weekly Promotion',
      profileimage_url: 'https://example.com/promo.jpg',
      isEnabled: true,
      store_id: 'store1',
    },
    {
      id: uuidv4(),
      index: 2,
      description: 'New tech event announcement',
      summary: 'Tech Event',
      isEnabled: false,
      store_id: 'store2',
    },
  ];
  
  const events = [
    {
      id: uuidv4(),
      title: 'Coffee Workshop',
      description: 'Learn how to brew coffee like a pro.',
      startAt: '2025-01-20T10:00:00',
      endAt: '2025-01-20T12:00:00',
      store_id: 'store1',
    },
    {
      id: uuidv4(),
      title: 'Tech Meetup',
      description: 'Discuss the latest in technology.',
      startAt: '2025-01-22T15:00:00',
      endAt: '2025-01-22T17:00:00',
      store_id: 'store2',
    },
    {
      id: uuidv4(),
      title: 'Tech Meetup2',
      description: 'Discuss the latest in technology.',
      startAt: '2025-02-21T15:00:00',
      endAt: '2025-02-21T17:00:00',
      store_id: 'store2',
    },
  ];
  
  export  { stores, notifications, events };