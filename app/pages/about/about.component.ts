import { Component, OnInit } from "@angular/core";

import { AboutService } from "../../services/about.service";

@Component({
    moduleId: module.id,
    selector: "new-pointe-about",
    templateUrl: "about.html"
})
export class AboutComponent implements OnInit {

    aboutText: string;
    loadingState = 0;

    constructor(private _aboutService: AboutService) { }

    ngOnInit() {
        this._aboutService.getAboutText().then(
            aboutText => {
                this.aboutText = aboutText;
                this.loadingState = 1;
            },
            error => {
                this.loadingState = -1;
            }
        );
    }
}
