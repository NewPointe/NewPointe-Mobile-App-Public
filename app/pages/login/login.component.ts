import { Component, ViewChild, ElementRef, AfterViewInit, ViewChildren, QueryList, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { TextField } from "ui/text-field";
import { connectionType, getConnectionType } from "connectivity";

import { alert } from "../../shared/dialog-util";
import { Config } from "../../shared/config";

import { UserCredentials, AuthService } from "../../services/auth.service";

@Component({
    moduleId: module.id,
    selector: "new-pointe-login",
    templateUrl: "login.html"
})
export class LoginComponent implements AfterViewInit {

    user: UserCredentials = new UserCredentials();
    private isLoading = false;

    @ViewChild("username") usernameElement: ElementRef;
    @ViewChild("password") passwordElement: ElementRef;

    private tryFocusElement(element: ElementRef) {
        if (element && element.nativeElement && element.nativeElement.focus) {
            element.nativeElement.focus();
        }
        else {
            console.log("Error: could not focus '" + element + "' element");
        }
    }

    constructor(
        private _page: Page,
        private _routerExtentions: RouterExtensions,
        private _authService: AuthService
    ) { }

    ngAfterViewInit() {
        Config.SkipLogin = "1";
        this.verifyToken();
    }

    verifyToken() {
        if (getConnectionType() === connectionType.none) {
            alert("This app requires an internet connection to log in.");
            return;
        }

        if (this._authService.getUserToken()) {

            this.isLoading = true;

            this._authService.loginWithCookie().then(
                () => {
                    this.isLoading = false;
                    this._routerExtentions.navigate(["/home"], { clearHistory: true });
                },
                error => {
                    this.isLoading = false;
                    alert("Your session has expired. Please login again.");

                }
            );
        }
    }

    login() {

        if (!this.user.Username || this.user.Username.trim() === "") {
            this.tryFocusElement(this.usernameElement);
            alert("Please enter your Username.").then(() => this.tryFocusElement(this.usernameElement));
        }
        else if (!this.user.Password || this.user.Password.trim() === "") {
            this.tryFocusElement(this.passwordElement);
            alert("Please enter your Password.").then(() => this.tryFocusElement(this.passwordElement));
        }
        else if (getConnectionType() === connectionType.none) {
            alert("This app requires an internet connection to log in.");
        }
        else {

            this.isLoading = true;

            this._authService.login(this.user).then(
                () => {
                    this.isLoading = false;
                    this._routerExtentions.navigate(["/home"], { clearHistory: true });
                },
                error => {
                    alert("Unfortunately we could not find your account.");
                    setTimeout(() => this.isLoading = false, 2000);
                }
            );
        }
    }

    signUp() {
        this._routerExtentions.navigate(["/register"],
            {
                transition: {
                    name: "slide",
                    duration: 300,
                    curve: "linear"
                }
            });
    }

    skipLogin() {
        Config.SkipLogin = "1";
        if(this._routerExtentions.canGoBack()){
            this._routerExtentions.back();
        }
        else {
            this._routerExtentions.navigate(["/home"], { clearHistory: true });
        }
    }
}
