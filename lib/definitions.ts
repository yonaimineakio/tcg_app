export type User = { 
    id: string;
    name: string;
    email: string;
    hashedPassword: string;
    isAdmin: boolean;
};

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

// export type RecurrenceRule = {
//     freq: "daily" | "weekly" | "monthly" | "yearly";
//     dstart: string;
//     until?: string;
//     count?: number;
//     byweekday?: string[];
// };

export type CalendarEvent = {
    id: string;
    title: string;
    description: string;
    startAt: string;
    endAt: string;
    store_id: string;
    //繰り返し設定は後ほど検討。
}
export type CalendarDisplayEvent = {
    id: string;
    title: string;
    description: string;
    start: string;
    end: string;
    store_id: string;
    //繰り返し設定は後ほど検討。
}
