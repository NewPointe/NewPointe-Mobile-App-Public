import { Injectable } from "@angular/core";
import { getJSON } from "http";

import { Config } from "../shared/config";

export interface MessageArchiveItem {
    Id: number;
    Title: string;
    SmallTileImageUrl: string;
}

export interface MessageArchiveIndividualItem {
    Id: number;
    Title: string;
    Date: string;
    Speaker: string;
    SpeakerTitle: string;
    VimeoLink: string;
    VimeoImage: string;
    Content: string;
    TalkItOver: string;
    Notes: string;
    AudioLink: string;
    AudioImage: string;
}

@Injectable()
export class MessageArchiveService {
    getMessageSeries = () => getJSON<Array<MessageArchiveItem>>(`${Config.apiUrl}/NPMessageSeries`);
    getMessagesForSeries = (seriesId) => getJSON<Array<MessageArchiveIndividualItem>>(`${Config.apiUrl}/NPMessages?seriesId=${seriesId}`);
}
