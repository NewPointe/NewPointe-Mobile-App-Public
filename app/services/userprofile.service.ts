import { Injectable } from '@angular/core';
import { request } from "http";

import { AuthService } from './auth.service';

import { Config } from "../shared/config";

export class UserProfile {
    FirstName: string;
    LastName: string;
    Email: string;
}

@Injectable()
export class UserProfileService {

    constructor(private authService: AuthService) { }

    getProfile(): Promise<UserProfile> {
        return request({
            method: "GET",
            url: `${Config.apiUrl}/NPProfile`,
            headers: {
                "Content-Type": "application/json",
                "Cookie": this.authService.getUserToken()
            }
        }).then(function (response) {
            if (response.statusCode >= 200 && response.statusCode < 400) {
                return response.content.toJSON();
            }
            else {
                return Promise.reject(new Error(response.statusCode + ''));
            }
        });
    }

    updateProfile(newProfile: UserProfile) {
        return request({
            method: "POST",
            url: `${Config.apiUrl}/NPProfile`,
            headers: {
                "Content-Type": "application/json",
                "Cookie": this.authService.getUserToken()
            },
            content: JSON.stringify(newProfile)
        }).then(function (response) {
            if (response.statusCode >= 200 && response.statusCode < 400) {
                return;
            }
            else {
                return Promise.reject(new Error(response.statusCode + ''));
            }
        });
    }
}
