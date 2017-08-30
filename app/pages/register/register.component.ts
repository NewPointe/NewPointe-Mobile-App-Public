import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { connectionType, getConnectionType } from "connectivity";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from '@angular/router';

import { alert } from "../../shared/dialog-util";
import { RegisterData, AuthService } from "../../services/auth.service";
import { Config } from "../../shared/config";

@Component({
    moduleId: module.id,
    selector: "register",
    templateUrl: "register.html"
})
export class RegisterComponent implements AfterViewInit {

    isBusy: boolean;
    registerData: RegisterData = new RegisterData();

    @ViewChild("firstNameElement") firstNameElement: ElementRef;
    @ViewChild("lastNameElement") lastNameElement: ElementRef;
    @ViewChild("emailElement") emailElement: ElementRef;
    @ViewChild("usernameElement") usernameElement: ElementRef;
    @ViewChild("passwordElement") passwordElement: ElementRef;

    private tryFocusElement(element: ElementRef) {
        if (element && element.nativeElement && element.nativeElement.focus) {
            element.nativeElement.focus();
        }
        else {
            console.log("Error: could not focus '" + element + "' element");
        }
    }

    constructor(
        private route: ActivatedRoute,
        private _changeDetectionRef: ChangeDetectorRef,
        private _routerExtentions: RouterExtensions,
        private _authService: AuthService
    ) { }

    ngAfterViewInit() {
        this._changeDetectionRef.detectChanges();
    }

    submit() {

        if (getConnectionType() === connectionType.none) {
            alert("This section requires an internet connection.");
        }
        else if (!this.registerData.FirstName || this.registerData.FirstName.trim() === "") {
            this.tryFocusElement(this.firstNameElement);
            alert("Please enter your First Name.").then(() => this.tryFocusElement(this.firstNameElement));
        }
        else if (!this.registerData.LastName || this.registerData.LastName.trim() === "") {
            this.tryFocusElement(this.lastNameElement);
            alert("Please enter your Last Name.").then(() => this.tryFocusElement(this.lastNameElement));
        }
        else if (!this.registerData.Email || this.registerData.Email.trim() === "") {
            this.tryFocusElement(this.emailElement);
            alert("Please enter your Email.").then(() => this.tryFocusElement(this.emailElement));
        }
        else if (!this.registerData.Username || this.registerData.Username.trim() === "") {
            this.tryFocusElement(this.usernameElement);
            alert("Please enter your Username.").then(() => this.tryFocusElement(this.usernameElement));
        }
        else if (!this.registerData.Password || this.registerData.Password.trim() === "") {
            this.tryFocusElement(this.passwordElement);
            alert("Please enter your Password.").then(() => this.tryFocusElement(this.passwordElement));
        }
        else {

            this.isBusy = true;
            this._authService.register(this.registerData)
                .then(res => {
                    this.isBusy = false;
                    alert("You have been registered. Please check your email to verify you're account.");
                    this._routerExtentions.navigate(["/home"]);
                },
                (error: Error) => {
                    this.isBusy = false;
                    alert(error.message);
                });
        }
    }
}
