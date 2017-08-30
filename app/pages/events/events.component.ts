import { Component, ViewChild, OnInit } from "@angular/core";

import { RadCalendar, CalendarEvent } from "nativescript-telerik-ui-pro/calendar/";
import { RadCalendarComponent } from 'nativescript-telerik-ui-pro/calendar/angular';

import { CalendarEventsService } from "../../services/calendar-events.service";

@Component({
    moduleId: module.id,
    selector: "new-pointe-events",
    templateUrl: "events.html"
})
export class EventsComponent implements OnInit {

    private events: Array<CalendarEvent>;
    private loadingState;

    @ViewChild(RadCalendarComponent) private calendarComponent: RadCalendarComponent;
    protected calendar: RadCalendar;

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
