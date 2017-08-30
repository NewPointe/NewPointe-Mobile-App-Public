import { Injectable } from '@angular/core';
import { getJSON } from "http";

import { Config } from "../shared/config";

export interface TheDailyItem {
    Id: number;
    Title: string;
    Date: string;
    Content: string;
    DailyPDF: string;
    ScriptureCards: string;
}

@Injectable()
export class TheDailyService {
    getDailyItemIds = () => getJSON<Array<number>>(`${Config.apiUrl}/NPTheDaily`);
    getDailyItem = (dailyId: number) => getJSON<TheDailyItem>(`${Config.apiUrl}/NPTheDaily/${dailyId}`);
}




