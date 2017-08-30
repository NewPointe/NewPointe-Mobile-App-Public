import { Component } from "@angular/core";

import { registerElement } from "nativescript-angular/element-registry";
import { Video } from "nativescript-videoplayer";

registerElement("VideoPlayer", () => Video);

@Component({
  selector: "main",
  template: "<page-router-outlet></page-router-outlet>"
})
export class AppComponent { }


