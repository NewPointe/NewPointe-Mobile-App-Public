import { getString, getJSON } from "http";

const API_BASE_URL = `http://live.newpointe.org/api/v1`;

export class ChurchOnlineAPI {

    private static _getJSON<T>(url): Promise<T> {
        return getJSON<ChurchOnlineAPIResponse<T>>(url).then(
            resp =>
                (resp.meta && resp.meta.status == 200) ?
                    Promise.resolve(resp.response) :
                    Promise.reject(new Error("Error getting live info: Invalid Request Status"))
        );
    }

    public static getCurrentEventStatus() {
        return ChurchOnlineAPI._getJSON<CurrentEventsData>(`${API_BASE_URL}/events/current`).then(r => r.item);
    }

    public static getEvents() {
        return ChurchOnlineAPI._getJSON<EventsData>(`${API_BASE_URL}/events`).then(r => r.items);
    }

    public static getEvent(id: number) {
        return ChurchOnlineAPI._getJSON<EventItemData>(`${API_BASE_URL}/events/${id}`);
    }

    public static getUpcomingEventTimes() {
        return ChurchOnlineAPI._getJSON<UpcomingEventTimesData>(`${API_BASE_URL}/upcoming_event_times`).then(r => r.items);
    }
}

// Generic interface for all API responses. All response data is wraped in this.
export interface ChurchOnlineAPIResponseMeta {
    status: number;
}
export interface ChurchOnlineAPIResponse<ResponseDataType> {
    meta: ChurchOnlineAPIResponseMeta;
    response: ResponseDataType;
}

// Response from the `/api/v1/events/current` endpoint
export interface CurrentEventsData {
    item: CurrentEventsItemData
}
export interface CurrentEventsItemData {
    isLive: boolean;
    eventStartTime: string;
}

// Response from the `/api/v1/events/` endpoint
export interface EventsData {
    count: number;
    items: EventItemData[];
}

// Response from the `/api/v1/events/{EventId}` endpoint
export interface EventItemData {
    id: number;
    organizationId: number;
    description: string;
    duration: number;
    enabled: boolean;
    speaker: string;
    title: string;
    vrSimulated?: null;
    sphericalVideo?: null;
    eventNotes: string;
    volunteerNotes: string;
    facebookMessage: string;
    twitterMessage: string;
    emailMessage: string;
    socialLink: string;
    slidesPaused: boolean;
    enabledFeatures: ["chat" | "notes"];
    customTab: CustomTabData;
    videoProfileStatus: "default";
}
export interface CustomTabData {
    id: number;
    title: string;
    content: string;
    sort_order?: any;
    visible: boolean;
    permanent: boolean;
    created_at: string;
    updated_at: string;
    organization_id: number;
}

// Response from the `/api/v1/upcoming_event_times` endpoint
export interface UpcomingEventTimesData {
    count: number;
    items: EventTimeData[];
}
export interface EventTimeData {
    eventTimeId: number;
    eventId: number;
    eventTime: string;
    eventEndTime: string;
    eventTitle: string;
    eventTimeDoorsOpenOffset: number;
}