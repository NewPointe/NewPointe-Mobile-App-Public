import { NgModule, enableProdMode, NO_ERRORS_SCHEMA } from "@angular/core";
enableProdMode();

import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { PreloadAllModules } from "@angular/router";

import { NativeScriptUISideDrawerModule } from "nativescript-pro-ui/sidedrawer/angular";
import { NativeScriptUIListViewModule } from 'nativescript-pro-ui/listview/angular';
import { NativeScriptUICalendarModule } from 'nativescript-pro-ui/calendar/angular';

import { AppComponent } from "./app.component";
import { appRoutes } from "./app.routes";
import { AuthGuard } from "./auth.guard";
import { CustomNavComponent } from "./shared/custom-nav/custom-nav.component";
import { LoadingViewComponent } from "./shared/loading-view/loading-view.component";
import { SeekbarComponent } from "./shared/seekbar/seekbar.component";

import {
    AboutComponent,
    AudioPlayerComponent,
    EventsComponent,
    HomeComponent,
    LiveComponent,
    LoginComponent,
    MessagesComponent,
    MessageNotesComponent,
    MessageItemsComponent,
    CustomNotesComponent,
    PrayerComponent,
    ProfileComponent,
    RegisterComponent,
    TheDailyComponent,
    VideoPlayerComponent
} from "./pages";

import {
    AboutService,
    AudioPlayerService,
    AuthService,
    CalendarEventsService,
    CustomNotesService,
    FeatureTileService,
    LiveService,
    MessageArchiveService,
    PrayerService,
    TheDailyService,
    UserProfileService
} from "./services";

@NgModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
        NativeScriptFormsModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUIListViewModule,
        NativeScriptUICalendarModule
    ],
    declarations: [
        CustomNavComponent,
        LoadingViewComponent,
        SeekbarComponent,
        AppComponent,
        AboutComponent,
        AudioPlayerComponent,
        EventsComponent,
        HomeComponent,
        LiveComponent,
        LoginComponent,
        MessagesComponent,
        MessageNotesComponent,
        MessageItemsComponent,
        CustomNotesComponent,
        PrayerComponent,
        ProfileComponent,
        RegisterComponent,
        TheDailyComponent,
        VideoPlayerComponent
    ],
    bootstrap: [AppComponent],
    providers: [
        AuthGuard,
        AboutService,
        AudioPlayerService,
        AuthService,
        CalendarEventsService,
        CustomNotesService,
        FeatureTileService,
        LiveService,
        MessageArchiveService,
        PrayerService,
        TheDailyService,
        UserProfileService
    ]
})
export class AppModule { }
