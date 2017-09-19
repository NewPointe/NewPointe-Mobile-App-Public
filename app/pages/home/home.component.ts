import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { openUrl } from "utils/utils";
import { DeviceOrientation } from 'ui/enums';
import { getOrientation } from "../../shared/orientation-util";
import * as app from "application";

import { AuthService } from "../../services/auth.service";
import { Config } from "../../shared/config";
import { LiveService } from "../../services/live.service";

const tiles = [
    {
        title: "Events",
        tile: "~/images/Events.png",
        url: "app://events"
    },
    {
        title: "Prayer",
        tile: "~/images/Prayer.png",
        url: "app://prayer"
    },
    {
        title: "Messages",
        tile: "~/images/Media.png",
        url: "app://messages"
    },
    {
        title: "The Daily",
        tile: "~/images/The Daily.png",
        url: "app://thedaily"
    },
    {
        title: "Donate",
        tile: "~/images/Donate.png",
        url: "https://newpointe.org/GiveNow"
    },
    {
        title: "Stories",
        tile: "~/images/Stories.png",
        url: "https://newpointe.org/stories"
    },
    {
        title: "Locations",
        tile: "~/images/Locations.png",
        url: "https://newpointe.org/locations"
    },
    {
        title: "About",
        tile: "~/images/About.png",
        url: "app://about"
    }
].map((p: any) => {
    if (p.title && !p.onTap && p.url) {
        p.onTap = n => n(p.url, p.clearBack);
    }
    return p;
});

@Component({
    moduleId: module.id,
    selector: "new-pointe-home",
    templateUrl: "home.html",
    styleUrls: ["home.common.css"]
})
export class HomeComponent implements OnInit {

    constructor(
        private _routerExtensions: RouterExtensions,
        private _liveService: LiveService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _authService: AuthService) { }

    get IsLive() {
        return this._liveService.isLive;
    }

    private colCount = 2;
    private colSizing = "*,*";

    private tiles = tiles;

    ngOnInit() {
        if (Config.SkipLogin !== "1" && !this._authService.getUserToken()) {
            this._routerExtensions.navigate(["/login"]);
        }
        app.on(app.orientationChangedEvent, this.onOrientationChange);
        this.onOrientationChange(getOrientation());
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
        this._changeDetectorRef.detectChanges();
    }

    getRowNum(index) {
        return Math.floor(index / this.colCount) + 2;
    }

    getColNum(index) {
        return index % this.colCount;
    }

    navigateTo = (url: string) => {
        const route = url.split("app:/", 2);
        if (route.length > 1) {
            this._routerExtensions.navigate(["/" + route[1]], {
                transition: {
                    name: "slide",
                    duration: 300,
                    curve: "linear"
                }
            });
        }
        else {
            openUrl(route[0]);
        }
    }
}
