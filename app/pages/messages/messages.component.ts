import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ObservableArray } from "data/observable-array";
import { Observable, PropertyChangeData } from "data/observable";
import { DeviceOrientation } from 'ui/enums';

import { ScrollView } from "ui/scroll-view";

import app = require("application");

import { getOrientation } from "../../shared/orientation-util";

import { MessageArchiveItem, MessageArchiveService } from "../../services/message-archive.service";

const itemsPerPage = 6;
const delta = 0.01;

@Component({
    moduleId: module.id,
    selector: "message-archive",
    templateUrl: "messages.html",
    styleUrls: ["messages.common.css"]
})
export class MessagesComponent implements OnInit {

    private loadingState = 0;

    private messageSeries: Array<MessageArchiveItem>;

    private currentMessages = new Array<MessageArchiveItem>();
    private pageNumber = 0;

    private showPrevious = false;
    private showNext = false;

    private colCount = 2;
    private colSizing = "*,*";

    @ViewChild('scrollView') private scrollViewElement: ElementRef;
    private scrollView: ScrollView;

    constructor(private _messageArchiveService: MessageArchiveService, private _routerExtensions: RouterExtensions, private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {

        this._messageArchiveService.getMessageSeries().then(
            loadedItems => {
                this.messageSeries = loadedItems;
                this.loadPage();
                this.loadingState = 1;
            },
            error => this.loadingState = -1
        );
        app.on(app.orientationChangedEvent, this.onOrientationChange);
        this.onOrientationChange(getOrientation());

        this.scrollView = this.scrollViewElement.nativeElement;
    }

    ngOnDestroy() {
        app.off(app.orientationChangedEvent, this.onOrientationChange);
    }

    onOrientationChange = eventData => {
        switch (eventData.newValue || eventData) {
            case DeviceOrientation.portrait:
                this.colCount = 2;
                this.colSizing = "*,*";
                break;
            case DeviceOrientation.landscape:
                this.colCount = 3;
                this.colSizing = "*,*,*";
                break;
            default:
        }
        this.changeDetectorRef.detectChanges();
    }

    onTap(id: number) {
        this._routerExtensions.navigate(["/messagedetails", id], {
            transition: {
                name: "slide",
                duration: 300,
                curve: "linear"
            }
        });
    }

    loadPage() {
        this.currentMessages = this.messageSeries.slice(this.pageNumber * itemsPerPage, (this.pageNumber * itemsPerPage) + itemsPerPage);
        this.showPrevious = (this.pageNumber + 1) * itemsPerPage < this.messageSeries.length - 1;
        this.showNext = this.pageNumber > 0;
        if(this.scrollView) {
            this.scrollView.scrollToVerticalOffset(0, false);
        }
    }

    getRowNum(index) {
        return Math.floor(index / this.colCount) + 2;
    }

    getColNum(index) {
        return index % this.colCount;
    }

    tapPrevious() {
        if (this.showPrevious) {
            ++this.pageNumber;
            this.loadPage();

        }
    }

    tapNext() {
        if (this.showNext) {
            --this.pageNumber;
            this.loadPage();
        }
    }
}
