import { Component, ViewChild, OnInit, NgZone, Input, ElementRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { openUrl } from "utils/utils";

import { isIOS } from "platform";

import { SwissArmyKnife } from 'nativescript-swiss-army-knife/nativescript-swiss-army-knife';
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-pro-ui/sidedrawer/angular";

import { AuthService } from "../../services/auth.service";
import { Config } from "../../shared/config";

import { AudioPlayerService, AudioPlayerState } from "../../services/audioplayer.service";
import { LiveService } from "../../services/live.service";

import { IconCodes } from "../material-icons";

interface MenuItem {
    title?: string;
    icon?: string;
    url?: string;
    onTap?(component: CustomNavComponent): void;
    showIf?(component: CustomNavComponent): boolean;
    divider?: boolean;
    clearBack?: boolean;
}

const MenuItems: MenuItem[] = [
    {
        showIf: c => c.isLive,
        title: "Live",
        url: "app://live",
        icon: String.fromCharCode(IconCodes.Live)
    },
    {
        showIf: c => c.isLive,
        divider: true
    },
    {
        title: "Home",
        url: "app://home",
        icon: String.fromCharCode(IconCodes.House)
    },
    {
        title: "Events",
        url: "app://events",
        icon: String.fromCharCode(IconCodes.Calendar)
    },
    {
        title: "Prayer",
        url: "app://prayer",
        icon: String.fromCharCode(IconCodes.Church)
    },
    {
        title: "Messages",
        url: "app://messages",
        icon: String.fromCharCode(IconCodes.VideoMessage)
    },
    {
        title: "The Daily",
        url: "app://thedaily",
        icon: String.fromCharCode(IconCodes.OpenBook)
    },
    {
        title: "Donate",
        icon: String.fromCharCode(IconCodes.Gift),
        onTap: c => c.navigateTo(Config.donateUrl)
    },
    {
        title: "Stories",
        url: "https://newpointe.org/stories",
        icon: String.fromCharCode(IconCodes.OpenBook)
    },
    { divider: true },
    {
        title: "About",
        url: "app://about",
        icon: String.fromCharCode(IconCodes.Info)
    },
    {
        title: "Locations",
        url: "https://newpointe.org/locations",
        icon: String.fromCharCode(IconCodes.Location)
    },
    { divider: true },
    {
        showIf: c => !c.isLoggedIn(),
        title: "Login",
        url: "app://login",
        icon: String.fromCharCode(IconCodes.Login),
        clearBack: false
    },
    {
        showIf: c => !c.isLoggedIn(),
        title: "Register",
        url: "app://register",
        icon: String.fromCharCode(IconCodes.Login),
        clearBack: false
    },
    {
        showIf: c => c.isLoggedIn(),
        title: "Profile",
        url: "app://profile",
        icon: String.fromCharCode(IconCodes.Person)
    },
    {
        showIf: c => c.isLoggedIn(),
        title: "Logout",
        icon: String.fromCharCode(IconCodes.Logout),
        onTap: c => { c.authService.logout(); c.navigateTo("app://home"); }
    },
    {
        showIf: c => c.isNowPlaying,
        divider: true
    },
    {
        showIf: c => c.isNowPlaying,
        title: "Now Playing",
        url: "app://audioplayer",
        icon: String.fromCharCode(IconCodes.MusicNote),
    },
].map((p: MenuItem) => {
    if (!p.onTap && p.url) {
        p.onTap = c => (c.navigateTo(p.url, p.clearBack));
    }
    return p;
});

const appPrefix = "app:";

@Component({
    moduleId: module.id,
    selector: "custom-nav",
    templateUrl: "custom-nav.html"
})
export class CustomNavComponent implements OnInit {

    @Input() title: string = "NewPointe";
    @Input() contentClass: string = "";
    @Input() forceMenu: boolean = false;

    @ViewChild(RadSideDrawerComponent) drawerComponent: RadSideDrawerComponent;
    protected drawer: SideDrawerType;

    @ViewChild("scrollComponent") scrollComponent: ElementRef;

    public loggedInName = "";
    public loggedInEmail = "";

    public showBack = false;

    private statuBarHeight: number = 0;

    isIos = isIOS;
    pageList = MenuItems;

    get isNowPlaying() {
        return this.audioPlayerService.state !== AudioPlayerState.Unloaded;
    }
    get isLive() {
        return this.liveService.isLive;
    }

    constructor(
        protected routerExtensions: RouterExtensions,
        protected ngZone: NgZone,
        protected audioPlayerService: AudioPlayerService,
        protected liveService: LiveService,
        public authService: AuthService
    ) { }

    ngOnInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        SwissArmyKnife.actionBarHideBackButton();

        SwissArmyKnife.setAndroidStatusBarColor("#58920D");

        if (this.scrollComponent && this.scrollComponent.nativeElement) {
            SwissArmyKnife.disableScrollBounce(this.scrollComponent.nativeElement);
        }

        this.loggedInName = " ";
        this.loggedInEmail = this.authService.getUsername();

        this.showBack = !this.forceMenu && this.routerExtensions.canGoBack();
    }

    isLoggedIn() {
        return !!this.authService.getUserToken();
    }

    navigateTo = (url: string, clearBack?: boolean) => {
        if (url.slice(0, appPrefix.length) === appPrefix) {
            this.navigateToRoute(url.slice(appPrefix.length), clearBack);
        }
        else {
            openUrl(url);
        }
    }

    navigateToRoute(route, clearBack?: boolean) {
        if (this.drawer.getIsOpen()) {
            this.drawer.off('drawerClosed');
            this.drawer.on('drawerClosed', () => {
                this.ngZone.run(() => {
                    this.finishNavigateToRoute(route, clearBack);
                    this.drawer.off('drawerClosed');
                });
            });
            this.drawer.closeDrawer();
        }
        else {
            this.finishNavigateToRoute(route, clearBack);
        }
    }

    finishNavigateToRoute(route, clearBack?: boolean) {
        this.routerExtensions.navigate(
            [route],
            {
                clearHistory: clearBack !== false,
                transition: {
                    name: "slide",
                    duration: 300,
                    curve: "linear"
                }
            }
        );
    }

    goBack() {
        if (this.routerExtensions.canGoBack()) {
            this.routerExtensions.back();
        }
        else {
            this.navigateTo("app://home");
        }
    }
}
