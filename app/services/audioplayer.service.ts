import { Injectable } from "@angular/core";
import { AudioPlayer, AudioPlayerState } from 'nativescript-np-audioplayer';

export interface QueuedItem {
    mediaUri: string;
    metadata: Object;
    albumArtUri: string;
}

@Injectable()
export class AudioPlayerService extends AudioPlayer {

    queuedItem: QueuedItem;

    constructor(){
        super();
    }
 }

export { AudioPlayerState }
