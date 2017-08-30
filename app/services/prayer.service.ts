import { Injectable } from "@angular/core";
import { request } from "http";

import { Config } from "../shared/config";

export class Prayer {
    FirstName: string;
    LastName: string;
    Email: string;
    Text: string;
}

@Injectable()
export class PrayerService {

    sendPrayer(prayer: Prayer) {
        return request({
            method: "POST",
            url: `${Config.apiUrl}/NPPrayerRequests`,
            content: JSON.stringify(prayer),
            headers: { "Content-Type": "application/json" }
        }).then(
            response => (response.statusCode >= 200 && response.statusCode < 400) ? response : Promise.reject(new Error(`Error sending request: (${response.statusCode}) '${response.content}'`))
        );
    }

}
