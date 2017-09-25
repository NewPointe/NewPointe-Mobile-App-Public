import { Component, AfterViewInit, ChangeDetectorRef, ElementRef, ViewChild } from "@angular/core";
import { connectionType, getConnectionType } from "connectivity";
import { TextView } from "ui/text-view";

import { alert } from "../../shared/dialog-util";
import { Prayer, PrayerService } from "../../services/prayer.service";
import { UserProfileService } from "../../services/userprofile.service";
import { AuthService } from "../../services/auth.service";

@Component({
    moduleId: module.id,
    selector: "new-pointe-prayer",
    templateUrl: "prayer.html"
})
export class PrayerComponent implements AfterViewInit {

    isBusy: boolean = false;
    prayer: Prayer = new Prayer();

    @ViewChild("firstNameElement") firstNameElement: ElementRef;
    @ViewChild("lastNameElement") lastNameElement: ElementRef;
    @ViewChild("emailElement") emailElement: ElementRef;
    @ViewChild("prayerElement") prayerElement: ElementRef;

    public tryFocusElement(element: ElementRef) {
        if (element && element.nativeElement && element.nativeElement.focus) {
            // Slight timeout to prevent prayer textview getting a newline >.>
            setTimeout( () => element.nativeElement.focus(), 10);
        }
        else {
            console.log("Error: could not focus '" + element + "' element");
        }
    }

    constructor(
        private _changeDetectionRef: ChangeDetectorRef,
        private _prayerService: PrayerService,
        private _userProfileService: UserProfileService,
        private _authService: AuthService
    ) { }

    ngAfterViewInit() {

        this.prayer.FirstName = "";
        this.prayer.LastName = "";
        this.prayer.Email = "";
        this.prayer.Text = "";

        if (this._authService.getUserToken()) {
            this._userProfileService.getProfile().then(
                userInfo => {
                    if (!this.prayer.FirstName && !this.prayer.LastName && !this.prayer.Email) {
                        this.prayer.FirstName = userInfo.FirstName;
                        this.prayer.LastName = userInfo.LastName;
                        this.prayer.Email = userInfo.Email;
                    }
                }
            );
        }
    }

    submit() {

        if (getConnectionType() === connectionType.none) {
            alert("This section requires an internet connection.");
        }
        else if (!this.prayer.FirstName || this.prayer.FirstName.trim() === "") {
            this.tryFocusElement(this.firstNameElement);
            alert("Please enter your First Name.").then(() => this.tryFocusElement(this.firstNameElement));
        }
        else if (!this.prayer.LastName || this.prayer.LastName.trim() === "") {
            this.tryFocusElement(this.lastNameElement);
            alert("Please enter your Last Name.").then(() => this.tryFocusElement(this.lastNameElement));
        }
        else if (!this.prayer.Text || this.prayer.Text.trim() === "") {
            this.tryFocusElement(this.prayerElement);
            alert("Please enter your Prayer Request.").then(() => this.tryFocusElement(this.prayerElement));
        }
        else {
            this.isBusy = true;
            this._prayerService.sendPrayer(this.prayer).then(
                res => {

                    this.isBusy = false;
                    this.prayer.Text = "";

                    alert("Your prayer has been sent!");

                },
                error => {
                    this.isBusy = false;
                    alert("Unfortunately we could not send your prayer at this time.");
                }
            );
        }
    }
}
