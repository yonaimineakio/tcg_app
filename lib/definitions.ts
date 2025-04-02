// export type User = { 
//     id: string;
//     name: string;
//     email: string;
//     hashedPassword: string;
//     isAdmin: boolean;
// };

export type Store = {
    id: string;
    name: string;
    description: string;
    business_start: string
    business_end: string;
    address: string;
    image_url?: string;

}

export type Notification = {
    id: string;
    index: number;
    description: string;
    summary: string;
    profile_image_url?: string;
    notify: boolean;
    store_id: string;
};



export type CalendarEvent = {
    id: string;
    title: string;
    description: string;
    startAt: string;
    endAt?: string;
    store_id: string;
    isrrule: boolean;
    rruleid?: string;
}

export type CalendarDisplayEventsWithStoreInfo = CalendarDisplayEvent & {
    store_name: string;
    store_image?: string;
}


export type CalendarDisplayEvent = {
    id: string;
    title: string;
    description: string;
    start: string;
    end?: string;
    store_id: string;
    rruleid?: string
}

export type UserEventParticipant = {
    event_id: string;
    provider_account_id: string;
    status: string;
}

export type UserAccount = {
    id: string;
    name: string;
    image_url: string;
    provider: string;
    provider_account_id: string;

}
// export type EventsParticipantsWithUserInfo = EventsParticipants & {
//     user_image_url: string;
// }
