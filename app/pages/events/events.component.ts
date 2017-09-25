import { Component, ViewChild, OnInit } from "@angular/core";

import { RadCalendar, CalendarEvent } from "nativescript-pro-ui/calendar/";
import { RadCalendarComponent } from 'nativescript-pro-ui/calendar/angular';

import { CalendarEventsService } from "../../services/calendar-events.service";

@Component({
    moduleId: module.id,
    selector: "new-pointe-events",
    templateUrl: "events.html"
})
export class EventsComponent implements OnInit {

    public events: Array<CalendarEvent>;
    public loadingState;

    @ViewChild(RadCalendarComponent) private calendarComponent: RadCalendarComponent;
    public calendar: RadCalendar;

    constructor(private _calendarService: CalendarEventsService) { }

    ngOnInit() {
        this.calendar = this.calendarComponent.calendar;
        this._calendarService.getCalendarEvents().then(
            loadedEvents => {
                this.events = loadedEvents;
                this.loadingState = 1;
            },
            error => this.loadingState = -1
        );
    }

    goToToday() {
        this.calendar.goToDate(new Date());
    }

}
