import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";

import { MessageArchiveService } from "../../services/message-archive.service";
import { Config } from "../../shared/config";

@Component({
    moduleId: module.id,
    selector: "new-pointe-messagenotes",
    templateUrl: "message-notes.html"
})
export class MessageNotesComponent implements OnInit {

    link: string = "";
    loadingState: number = 0;
    theMessageId = -1;

    constructor(
        private route: ActivatedRoute,
        private _routerExtentions: RouterExtensions,
        private _messageArchiveService: MessageArchiveService,
        private _changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {

        let messageId = this.route.snapshot.params["id"];
        this.theMessageId = messageId;

        if (+messageId === -1) {
            this._messageArchiveService
                .getMessageSeries()
                .then(series => this._messageArchiveService.getMessagesForSeries(series[0].Id))
                .then(messages => {
                    if (messages && messages.length > 0) {
                        let mostRecentId = messages[messages.length - 1].Id;
                        this.link = "https://newpointe.org/message-notes?Id=" + encodeURIComponent(mostRecentId + "");

                        this.theMessageId = mostRecentId;

                    }
                    else {
                        this.link = "https://newpointe.org/message-notes?Id=-1";
                    }
                })
                .catch(error => this.loadingState = -1);
        }
        else {
            this.link = "https://newpointe.org/message-notes?Id=" + encodeURIComponent(messageId);
        }
    }

    onLoadFinished() {
        if (this.link !== "") {
            setTimeout(() => {
                this.loadingState = 1;
            }, 500);
        }
    }

    goCustomNotes() {
        this._routerExtentions.navigate(["/customnotes", this.theMessageId]);
    }

    goBack() {
        if (this._routerExtentions.canGoBack()) {
            this._routerExtentions.back();
        }
        else {
            this._routerExtentions.navigate(["/home"]);
        }
    }

}
