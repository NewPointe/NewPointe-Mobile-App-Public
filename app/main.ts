import { platformNativeScriptDynamic } from "nativescript-angular/platform";

import { AppModule } from "./app.module";

platformNativeScriptDynamic({ startPageActionBarHidden: false }).bootstrapModule(AppModule);
