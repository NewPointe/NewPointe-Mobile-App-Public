import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";
import { connectionType, getConnectionType } from "connectivity";
import { CustomNotesService, CustomNote } from "../../services/custom-notes.service";
import { Config } from "../../shared/config";

@Component({
    moduleId: module.id,
    selector: "new-pointe-customnotes",
    templateUrl: "custom-notes.html"
})
export class CustomNotesComponent implements OnInit {

    private loadingState = 0;
    customNote: CustomNote = new CustomNote();

    noteBoxEnabled = false;

    constructor(private route: ActivatedRoute, private _routerExtentions: RouterExtensions, private _customNotesService: CustomNotesService) { }

    ngOnInit() {

        let messageId = this.route.snapshot.params["id"];

        if (+messageId !== -1) {

            this.customNote.MessageId = messageId;


            this._customNotesService.getNotes(messageId).then(
                noteText => {
                    this.customNote.Notes = noteText;
                    this.noteBoxEnabled = true;
                    this.loadingState = 1;
                },
                error => {
                    this.loadingState = -1;
                }
            );

        }

    }

    submit() {

        if (getConnectionType() === connectionType.none) {
            alert("This section requires an internet connection to save.");
            return;
        }

        this.loadingState = 0;
        this._customNotesService.update(this.customNote).then(
            success => {
                this.loadingState = 1;
                alert("Your notes have been saved!");
            },
            error => {
                this.loadingState = 1;
                alert("Unfortunately we could not send your notes at this time.");
            }
        );

    }


    goBack() {
        this._routerExtentions.back();
    }

}
