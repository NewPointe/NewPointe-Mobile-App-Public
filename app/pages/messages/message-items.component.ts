import { Component, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { Page } from "ui/page";
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";
import { openUrl } from "utils/utils";
import { SegmentedBar, SegmentedBarItem } from "ui/segmented-bar";

import { MessageArchiveIndividualItem, MessageArchiveService } from "../../services/message-archive.service";
import { AudioPlayerService } from "../../services/audioplayer.service";

@Component({
    moduleId: module.id,
    selector: "message-items",
    templateUrl: "message-items.html",
    styleUrls: ["message-items.common.css"]
})
export class MessageItemsComponent implements AfterViewInit {

    private messages: Array<MessageArchiveIndividualItem>;

    private currentItem: MessageArchiveIndividualItem = {
        Id: -1,
        Title: "",
        Date: "",
        Speaker: "",
        SpeakerTitle: "",
        VimeoLink: "",
        VimeoImage: "",
        AudioImage: "",
        AudioLink: "",
        Content: "",
        Notes: "",
        TalkItOver: ""
    };


    public loadingState = 0;
    private navbarItems: Array<SegmentedBarItem> = [];

    private showVideo = false;
    private showNotes = false;
    private showTalk = false;
    private showPodcast = false;

    constructor(
        private page: Page,
        private route: ActivatedRoute,
        private _routerExtentions: RouterExtensions,
        private _messageArchiveService: MessageArchiveService,
        private _audioService: AudioPlayerService,
        private _changeDetectorRef: ChangeDetectorRef
    ) { }

    ngAfterViewInit() {
        this._messageArchiveService.getMessagesForSeries(this.route.snapshot.params["id"]).then(
            messages => {
                if (messages[0]) {
                    this.messages = messages;

                    this.navbarItems = [];
                    this.messages.forEach((m, i) => {
                        const item = new SegmentedBarItem();
                        item.title = `Part ${i + 1}`;
                        this.navbarItems.push( item );
                    });

                    this.loadingState = 1;
                }
                else {

                    this.loadingState = -1;
                }
            },
            error => {
                this.loadingState = -1;
            }
        );
    }

    tabIndexChanged(e: any) {
        if (this.messages && this.messages[e.newIndex]) {
            this.currentItem = this.messages[e.newIndex];
            this.currentItem.Content = this.currentItem.Content.replace(/&nbsp;/g, " ");
            this.showVideo = !!this.currentItem.VimeoLink;
            this.showNotes = !!this.currentItem.Notes;
            this.showTalk = !!this.currentItem.TalkItOver;
            this.showPodcast = !!this.currentItem.AudioLink;
            this._changeDetectorRef.detectChanges();
        }
    }

    goToVideo() {
        this._routerExtentions.navigate(["/videoplayer", encodeURIComponent(this.currentItem.VimeoLink)]);
    }

    launchMyNotes() {
        this._routerExtentions.navigate(["/customnotes", this.currentItem.Id]);
    }

    launchNotes() {
        openUrl(this.currentItem.Notes);
    }

    launchTalk() {
        openUrl(this.currentItem.TalkItOver);
    }

    launchPodcast() {
        openUrl(this.currentItem.AudioLink);
    }

    togglePlayAudio() {
        this._audioService.unload();
        this._audioService.queuedItem = {
            mediaUri: this.currentItem.AudioLink,
            metadata: {
                title: this.currentItem.Title,
                subtitle: this.currentItem.Speaker,
            },
            albumArtUri: this.currentItem.AudioImage
        };
        this._routerExtentions.navigate(['/audioplayer']);
    }

}
