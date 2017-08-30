import { Component, Input, Output, EventEmitter } from "@angular/core";
import { TouchGestureEventData, TouchAction } from "ui/gestures";
import { Observable, EventData } from "data/observable";

export enum SeekEventAction {
    Start,
    Update,
    End,
    Cancel
}

export interface SeekEventData extends EventData {
    action: SeekEventAction;
    value: number;

}

@Component({
    moduleId: module.id,
    selector: "Seekbar",
    template: `<GridLayout height="40"><Slider minValue="0" maxValue="100" [value]="seekValue"></Slider><StackLayout (touch)="onTouchEvent($event)"></StackLayout></GridLayout>`
})
export class SeekbarComponent extends Observable {

    constructor() {
        super();
    }

    @Input() set value(percent: number) {
        this.setValue(percent);
    }
    get value() {
        return this.trueValue;
    }

    public setValue(percent: number) {
        percent = Math.min(Math.max(percent, 0),100);
        if(this.trueValue !== percent) {
            this.trueValue = percent;
            if (!this.isSeeking && !this.isSlowSeeking) {
                this.seekValue = this.trueValue;
            }
        }
    }

    public getValue(): number {
        return this.trueValue;
    }

    @Output() public seek = new EventEmitter<SeekEventData>();
    @Output() public seekStart = new EventEmitter();
    @Output() public seekUpdate = new EventEmitter();
    @Output() public seekEnd = new EventEmitter();
    @Output() public seekCancel = new EventEmitter();
    
    private trueValue = 50;
    private seekValue = 50;
    private isSeeking = false;

    private slowSeekOriginalValue = 0;
    private slowSeekStartValue = 0;
    private isSlowSeeking = false;

    onTouchEvent(event: TouchGestureEventData) {

        const x = event.getX();
        const y = event.getY();
        //const w = event.view.getMeasuredWidth();
        //const h = event.view.getMeasuredHeight();
        const realSize = event.view.getActualSize();
        const w = realSize.width;
        const h = realSize.height;
        const z = 10; // Drag circle diameter

        const a = w / 2;
        let xValAdj = (a + (a * (x - a) / (a - z))) / w * 100;

        const touchValue = Math.min(Math.max(xValAdj, 0), 100);
        switch (event.action) {
            case TouchAction.down:
                const closeness = Math.abs(this.trueValue - touchValue);
                if (closeness < (z / 2)) {
                    this.isSeeking = true;
                }
                else if (closeness > z) {
                    this.isSlowSeeking = true;
                    this.slowSeekStartValue = touchValue;
                    this.slowSeekOriginalValue = this.seekValue;
                }
                if(this.isSeeking || this.isSlowSeeking) {
                    this.seek.emit({
                        eventName: "seek",
                        action: SeekEventAction.Start,
                        object: this,
                        value: this.seekValue
                    });
                }
                break;
            case TouchAction.move:
                if (this.isSeeking) {
                    if (this.isSlowSeeking) {
                        this.seekValue = Math.min(Math.max(this.slowSeekOriginalValue + ((xValAdj - this.slowSeekStartValue) * 0.1), 0), 100);
                        if (y > (-z * 14) && y < (z * 14) + h) {
                            this.isSlowSeeking = false;
                        }
                    }
                    else {
                        this.seekValue = touchValue;
                        if (y < (-z * 14) || y > (z * 14) + h) {
                            this.isSlowSeeking = true;
                            this.slowSeekOriginalValue = this.slowSeekStartValue = this.seekValue;
                        }
                    }
                }
                else if (this.isSlowSeeking) {
                    this.seekValue = Math.min(Math.max(this.slowSeekOriginalValue + ((xValAdj - this.slowSeekStartValue) * 0.2), 0), 100);
                }
                
                if(this.isSeeking || this.isSlowSeeking) {
                    this.seek.emit({
                        eventName: "seek",
                        action: SeekEventAction.Update,
                        object: this,
                        value: this.seekValue
                    });
                }

                break;
            case TouchAction.up:
                if (this.isSeeking || this.isSlowSeeking) {
                    this.isSeeking = false;
                    this.isSlowSeeking = false;
                    this.trueValue = this.seekValue;
                    this.seek.emit({
                        eventName: "seek",
                        action: SeekEventAction.End,
                        object: this,
                        value: this.seekValue
                    });
                }
                break;
            case TouchAction.cancel:
            default:
                if (this.isSeeking || this.isSlowSeeking) {
                    this.isSeeking = false;
                    this.isSlowSeeking = false;
                    this.seekValue = this.trueValue;
                    this.seek.emit({
                        eventName: "seek",
                        action: SeekEventAction.Cancel,
                        object: this,
                        value: this.seekValue
                    });
                }
                break;
        }
    }

}
