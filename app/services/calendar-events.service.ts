import { Injectable } from "@angular/core";
import { getJSON } from "http";
import { Config } from "../shared/config";

import { Calendar } from "nativescript-telerik-ui-pro/calendar/angular";
import { Color } from "color";

const colors: Array<Color> = [new Color(200, 188, 26, 214), new Color(220, 255, 109, 130), new Color(255, 55, 45, 255), new Color(199, 17, 227, 10), new Color(255, 255, 54, 3)];

@Injectable()
export class CalendarEventsService {
    getCalendarEvents = () => getJSON(Config.eventsUrl).then(
        (events: Array<any>) => events.map(
            (event, cnt) => {

                const currDate = new Date();
                const timeZoneDiff = currDate.getTimezoneOffset() * 60000;
                const startDate = new Date(+event.start + timeZoneDiff);
                const endDate = new Date(+event.end + timeZoneDiff);

                return new Calendar.CalendarEvent(
                    event.title,
                    startDate,
                    endDate,
                    false,
                    colors[cnt * 10 % (colors.length - 1)]
                );
            }
        )
    );
}


