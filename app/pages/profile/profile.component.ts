import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { connectionType, getConnectionType } from "connectivity";

import { UserProfile, UserProfileService } from "../../services/userprofile.service";
import { Config } from "../../shared/config";

@Component({
    moduleId: module.id,
    selector: "new-pointe-profile",
    templateUrl: "profile.html"
})

export class ProfileComponent implements OnInit {

    isBusy: boolean;
    user: UserProfile = new UserProfile();

    @ViewChild("firstName") firstNameElement: ElementRef;
    @ViewChild("lastName") lastNameElement: ElementRef;
    @ViewChild("email") emailElement: ElementRef;

    private tryFocusElement(element: ElementRef) {
        if (element && element.nativeElement && element.nativeElement.focus) {
            element.nativeElement.focus();
        }
        else {
            console.log("Error: could not focus '" + element + "' element");
        }
    }

    constructor(private _userProfileService: UserProfileService) { }

    ngOnInit() {
        this._userProfileService.getProfile()
            .then(userItem => {

                this.user = userItem;
                this.isBusy = false;

            });
    }

    submit() {

        this.isBusy = true;

        if (getConnectionType() === connectionType.none) {
            alert("This app requires an internet connection to log in.");
            return;
        }

        this._userProfileService.updateProfile(this.user)
            .then(res => {
                this.isBusy = false;
                alert("Your profile has been updated!");
            },
            error => {
                this.isBusy = false;
                alert("Unfortunately we could not update your profile at this time.");
            });
    }

}
