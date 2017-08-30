import { Injectable } from '@angular/core';

import { request, HttpResponse } from "http";
import { getString, setString } from "application-settings";

import { Config } from "../shared/config";

import { isAndroid } from 'platform';
declare var java;

export class UserCredentials {
    Username: string;
    Password: string;
}

export class RegisterData {
    FirstName: string;
    LastName: string;
    Email: string;
    Username: string;
    Password: string;
}

const PREFERENCE_KEY_USERNAME = "userName";
const PREFERENCE_KEY_TOKEN = "token";

@Injectable()
export class AuthService {

    login(user: UserCredentials) {
        return request({
            method: "POST",
            url: `${Config.apiUrl}/Auth/Login`,
            headers: {
                "Content-Type": "application/json"
            },
            content: JSON.stringify({
                Username: user.Username,
                Password: user.Password,
                Persited: "true"
            })
        }).then(
            response => {
                this.clearCookieJar();
                if (response.statusCode >= 200 && response.statusCode < 400) {
                    const setCookies = response.headers["Set-Cookie"];
                    const firstCookie = Array.isArray(setCookies) ? setCookies[0] : setCookies;

                    const token = firstCookie.split(";")[0]; // Should always be the .ROCK cookie

                    this._setUserToken(token);
                    this._setUsername(user.Username);

                }
                else {
                    return Promise.reject(new Error(response.statusCode + ''));
                }
            });
    }

    logout() {
        this._setUsername("");
        this._setUserToken("");
    }

    register(registerData: RegisterData) {
        return request({
            method: "POST",
            url: `${Config.apiUrl}/NPRegister`,
            headers: {
                "Content-Type": "application/json"
            },
            content: JSON.stringify(registerData)
        }).then(
            response => {
                this.clearCookieJar();
                if (response.statusCode >= 200 && response.statusCode < 400) {
                    return;
                }
                else {
                    let errMsg = "Unfortunately we could not register your account at this time.";
                    try {
                        errMsg = response.content.toJSON()["Message"];
                    }
                    catch (e) {
                        //
                    }
                    return Promise.reject(new Error(errMsg));
                }
            });
    }

    loginWithCookie() {
        return Promise.reject(new Error());
    }

    getUsername() {
        return getString(PREFERENCE_KEY_USERNAME);
    }

    private _setUsername(username: string) {
        setString(PREFERENCE_KEY_USERNAME, username);
    }

    getUserToken() {
        return getString(PREFERENCE_KEY_TOKEN);
    }

    private _setUserToken(token: string) {
        setString(PREFERENCE_KEY_TOKEN, token);
    }

    // Needed on android to prevent duplicate cookie headers, etc
    private clearCookieJar() {
        if (isAndroid) {
            java.net.CookieHandler.setDefault(new java.net.CookieManager());
        }
    }

}
