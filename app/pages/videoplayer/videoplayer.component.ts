import { Component, ElementRef, ViewChild, OnInit, OnDestroy, Input } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { DeviceOrientation } from "ui/enums";

import { getOrientation } from "nativescript-orientation";
import { Video } from "nativescript-videoplayer";
import { device } from "platform";
import app = require("application");

import { Config } from "../../shared/config";

declare var android;
declare var AVAudioSession, AVAudioSessionCategoryPlayback;

@Component({
    moduleId: module.id,
    selector: "new-pointe-videoplayer",
    templateUrl: "videoplayer.html"
})
export class VideoPlayerComponent implements OnInit, OnDestroy {

    @Input() title: string = "Video";
    @Input() src: string;

    @ViewChild("videoPlayer") videoPlayerElement: ElementRef;
    videoPlayer: Video;

    constructor(private page: Page, private route: ActivatedRoute, private _routerExtentions: RouterExtensions) { }

    ngOnInit() {

        if (app.ios) {
            AVAudioSession.sharedInstance().setCategoryError(AVAudioSessionCategoryPlayback);
            AVAudioSession.sharedInstance().setActiveError(true);
        }

        this.src = decodeURIComponent(this.route.snapshot.params["src"]);
        this.videoPlayer = this.videoPlayerElement.nativeElement as Video;
        app.on(app.orientationChangedEvent, () => this.onOrientationChange());
        this.onOrientationChange();
    }

    ngOnDestroy() {
        app.off(app.orientationChangedEvent);
        this.clearImersiveMode();
        try {
            this.videoPlayer.destroy();
            if (app.ios) {
                AVAudioSession.sharedInstance().setActiveError(false);
            }
        } catch (e) {
            // Ignored
        }
    }

    onOrientationChange() {
        const orientation = getOrientation();
        if (orientation === DeviceOrientation.landscape) {
            this.triggerImersiveMode();
        }
        else if (orientation === DeviceOrientation.portrait) {
            this.clearImersiveMode();
        }
    }

    triggerImersiveMode() {
        this.page.actionBarHidden = true;
        if (app.android && device.sdkVersion >= '21') {
            app.android.startActivity.getWindow().getDecorView().setSystemUiVisibility(
                android.view.View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | android.view.View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | android.view.View.SYSTEM_UI_FLAG_FULLSCREEN
                | android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
        }
    }

    clearImersiveMode() {
        this.page.actionBarHidden = false;
        if (app.android && device.sdkVersion >= '21') {
            app.android.startActivity.getWindow().getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_VISIBLE);
        }
    }

    goBack() {
        this._routerExtentions.back();
    }
}
