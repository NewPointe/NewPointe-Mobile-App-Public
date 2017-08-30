import { Component, Input } from "@angular/core";

export enum LoadingState {
    Loading = 0,
    Error = -1,
    Done = 1
}

@Component({
    moduleId: module.id,
    selector: "loading-view",
    templateUrl: "loading-view.html"
})
export class LoadingViewComponent {

    @Input() loadingState: number = 0;
    @Input() errorMessage: string = "Error loading data.";

 }
