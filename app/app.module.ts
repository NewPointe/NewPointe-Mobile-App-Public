import { NgModule, enableProdMode } from "@angular/core";
enableProdMode();

import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { PreloadAllModules } from "@angular/router";

import { SIDEDRAWER_DIRECTIVES } from "nativescript-pro-ui/sidedrawer/angular";
import { LISTVIEW_DIRECTIVES } from 'nativescript-pro-ui/listview/angular';
import { CALENDAR_DIRECTIVES } from 'nativescript-pro-ui/calendar/angular';

import { AppComponent } from "./app.component";
import { appRoutes } from "./app.routes";
import { AuthGuard } from "./auth.guard";
import { CustomNavComponent } from "./shared/custom-nav/custom-nav.component";
import { LoadingViewComponent } from "./shared/loading-view/loading-view.component";
import { SeekbarComponent } from "./shared/seekbar/seekbar.component";

import * as Services from "./services";

@NgModule({
    imports: [
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
        NativeScriptFormsModule
    ],
    declarations: [
        SIDEDRAWER_DIRECTIVES,
        LISTVIEW_DIRECTIVES,
        CALENDAR_DIRECTIVES,
        CustomNavComponent,
        LoadingViewComponent,
        SeekbarComponent,
        AppComponent,
        ...appRoutes.filter(p => !!p.component).map(p => p.component)
    ],
    bootstrap: [AppComponent],
    providers: [...Object.keys(Services).map(k => Services[k]), AuthGuard]
})
export class AppModule { }
