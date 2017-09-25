import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SwipeGestureEventData, SwipeDirection } from "ui/gestures";
import { ScrollView } from "ui/scroll-view";


import { Config } from "../../shared/config";
import { TheDailyItem, TheDailyService } from "../../services/thedaily.service";
import { openUrl } from "utils/utils";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]

@Component({
    moduleId: module.id,
    selector: "new-pointe-thedaily",
    templateUrl: "thedaily.html",
    styleUrls: ["thedaily.common.css"],
    providers: [TheDailyService]
})
export class TheDailyComponent implements OnInit {

    public loadingState = 0;

    private dailyIds: Array<number> = [];

    private pageNumber = 0;

    public showPrevious = false;
    public showNext = false;

    public currentDaily: TheDailyItem;

    public showPDF = false;
    public showScripture = false;

    @ViewChild('scrollView') private scrollViewElement: ElementRef;
    private scrollView: ScrollView;

    constructor(private _theDailyService: TheDailyService) {
    }

    ngOnInit() {
        this._theDailyService.getDailyItemIds().then(
            dailyIds => {
                this.dailyIds = dailyIds;
                this.loadPage();
            },
            error => this.loadingState = 1
        );
        this.scrollView = this.scrollViewElement.nativeElement;
    }

    launchPDF() {
        openUrl(this.currentDaily.DailyPDF);
    }

    launchScripture() {
        openUrl(this.currentDaily.ScriptureCards);
    }

    tapPrevious() {
        if (this.showPrevious) {
            ++this.pageNumber;
            this.loadPage();

        }
    }

    tapNext() {
        if (this.showNext) {
            --this.pageNumber;
            this.loadPage();
        }
    }

    onSwipe(args: SwipeGestureEventData) {
        if (args.direction === SwipeDirection.left) {
            this.tapNext();
        }
        else if (args.direction === SwipeDirection.right) {
            this.tapPrevious();
        }
    }

    loadPage() {
        this.loadingState = 0;
        this.showPrevious = this.pageNumber < this.dailyIds.length;
        this.showNext = this.pageNumber > 0;
        this._theDailyService.getDailyItem(this.dailyIds[this.pageNumber]).then(
            dailyItem => {
                dailyItem.Content = dailyItem.Content.replace(/&nbsp;/g, " ");

                const date = new Date(dailyItem.Date);
                dailyItem.Date = `${monthNames[date.getUTCMonth()]}. ${date.getUTCDate()} ${date.getUTCFullYear()}`;

                this.currentDaily = dailyItem;
                this.showPDF = !!this.currentDaily.DailyPDF;
                this.showScripture = !!this.currentDaily.ScriptureCards;

                this.loadingState = 1;
                if (this.scrollView) {
                    this.scrollView.scrollToVerticalOffset(0, false);
                }
            },
            error => this.loadingState = -1
        );
    }
}
