import { Observable } from "data/observable";
import { Injectable } from "@angular/core";
import { getString, getJSON } from "http";
import { Config } from "../shared/config";

import { ChurchOnlineAPI } from '../shared/ChurchOnlineAPI';

const CACHE_TIME_MS = 1000 * 60 * 60 * 4; // Minimum MS to cache results for (4 hours)
const CACHE_TIME_ATTEMPT_MS = 1000 * 60; // Minimum MS to wait between update attempts (1 minute)
const EVENT_START_TIME_MARGIN_MS = 1000 * 60 * 5; // Margin MS to add to the begining of an event (5 minutes)
const EVENT_END_TIME_MARGIN_MS = 0; // Margin MS to add to the end of an event

interface CachedEvent {
    Name: string;
    StartDateTime: number;
    EndDateTime: number;
}

@Injectable()
export class LiveService extends Observable {

    private _cacheUpdateTime = 0;
    private _cacheUpdateAttemptTime = 0;
    private _cachedEvents: CachedEvent[] = [];
    private _updatingCache = false;

    get isLive() {
        const now = Date.now();
        if (
            !this._updatingCache // Not in the middle of updating
            && now - this._cacheUpdateTime > CACHE_TIME_MS // Cache is stale
            && now - this._cacheUpdateAttemptTime > CACHE_TIME_ATTEMPT_MS // Haven't tried recently
        ) {
            this._updatingCache = true;
            this._cacheUpdateAttemptTime = now;
            ChurchOnlineAPI.getUpcomingEventTimes().then(
                events => {
                    this._cachedEvents = events.map(evt => ({
                        Name: evt.eventTitle,
                        StartDateTime: new Date(evt.eventTime).valueOf(),
                        EndDateTime: new Date(evt.eventEndTime).valueOf()
                    }));

                    this.notify(
                        {
                            object: this
                            , eventName: Observable.propertyChangeEvent
                            , propertyName: "isLive"
                            , value: this._checkIsLive()
                        });

                    this._cacheUpdateTime = Date.now();
                    this._updatingCache = false;
                },
                error => {
                    this._cacheUpdateAttemptTime = Date.now();
                    this._updatingCache = false;
                }
            );
        }
        return this._checkIsLive();
    }

    private _checkIsLive() {
        const now = Date.now();
        return this._cachedEvents.some(evt => evt.StartDateTime - EVENT_START_TIME_MARGIN_MS < now && now < evt.EndDateTime + EVENT_END_TIME_MARGIN_MS);
    }

    constructor() {
        super();
    }

}
