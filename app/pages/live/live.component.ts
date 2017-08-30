import { Component } from "@angular/core";
import { Router } from '@angular/router';

import { AudioPlayerService } from "../../services/audioplayer.service";
import { Config } from "../../shared/config";

@Component({
    moduleId: module.id,
    selector: "new-pointe-live",
    templateUrl: "live.html"
})
export class LiveComponent {

    constructor(private _router: Router, private _audioService: AudioPlayerService) { }

    gotoLiveVideo() {
        this._router.navigate(['/videoplayer', encodeURIComponent(Config.liveVideoUrl)]);
    }

    togglePlayAudio() {
        this._audioService.unload();
        this._audioService.queuedItem = {
            mediaUri: Config.liveAudioUrl,
            metadata: {
                title: "NewPointe Live"
             },
             albumArtUri: "~/images/no-image.png"
        };
        this._router.navigate(['/audioplayer']);
    }
}
