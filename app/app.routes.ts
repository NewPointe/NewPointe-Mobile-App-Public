import { AuthGuard } from "./auth.guard";
import { Routes } from "@angular/router";

import * as Pages from "./pages";

export const appRoutes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: Pages.HomeComponent, pathMatch: "full" },
    { path: "live", component: Pages.LiveComponent, pathMatch: "full" },
    { path: "events", component: Pages.EventsComponent, pathMatch: "full" },
    { path: "prayer", component: Pages.PrayerComponent, pathMatch: "full" },
    { path: "messages", component: Pages.MessagesComponent, pathMatch: "full" },
    { path: "messagedetails/:id", component: Pages.MessageItemsComponent, pathMatch: "full" },
    { path: "messagenotes/:id", component: Pages.MessageNotesComponent, pathMatch: "full" },
    { path: "customnotes/:id", component: Pages.CustomNotesComponent, pathMatch: "full" },
    { path: "videoplayer/:src", component: Pages.VideoPlayerComponent, pathMatch: "full" },
    { path: "thedaily", component: Pages.TheDailyComponent, pathMatch: "full" },
    { path: "about", component: Pages.AboutComponent, pathMatch: "full" },
    { path: "login", component: Pages.LoginComponent, pathMatch: "full" },
    { path: "register", component: Pages.RegisterComponent, pathMatch: "full" },
    { path: "profile", component: Pages.ProfileComponent, pathMatch: "full" },
    { path: "audioplayer", component: Pages.AudioPlayerComponent, pathMatch: "full" },
];
