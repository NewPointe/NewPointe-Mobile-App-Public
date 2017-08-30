import { Injectable } from "@angular/core";
import { getJSON, request } from "http";

import { AuthService } from "./auth.service";

import { Config } from "../shared/config";

export class CustomNote {
    MessageId: number;
    Notes: string;
}

@Injectable()
export class CustomNotesService {

    constructor(private authService: AuthService) { }

    getNotes(messageId: number): Promise<string> {
        return getJSON({
            method: "GET",
            url: `${Config.apiUrl}/NPMyNotes/${messageId}`,
            headers: {
                "Content-Type": "application/json",
                "Cookie": this.authService.getUserToken()
            }
        });
    }

    update(customNote: CustomNote) {
        return request({
            method: "POST",
            url: `${Config.apiUrl}/NPMyNotes`,
            headers: {
                "Content-Type": "application/json",
                "Cookie": this.authService.getUserToken()
            },
            content: JSON.stringify(customNote)
        });
    }
}
