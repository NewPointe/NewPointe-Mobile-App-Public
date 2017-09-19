import { Injectable } from "@angular/core";
import { getString } from "http";

import { Config } from "../shared/config";

@Injectable()
export class FeatureTileService {
    getFeatureTile = () => getString(`https://newpointe.org/GetChannelFeed.ashx?ChannelId=11&TemplateId=1108`).then(
        resp => resp.split("|")
    );
}
