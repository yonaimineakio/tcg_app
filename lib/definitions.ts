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
    startAt: string
    endAt: string;
    address: string;
}

export type Notification = {
    id: string;
    index: number;
    description: string;
    summary: string;
    profileImageUrl?: string;
    isEnabled: boolean;
    storeId: string;
};

export type CalendarEvent = {
    id: string;
    title: string;
    description: string;
    start: string;
    end: string;
    storeId: string;
    //繰り返し設定は後ほど検討。
}
