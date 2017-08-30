import { Injectable } from "@angular/core";
import { getJSON } from "http";

import { Config } from "../shared/config";

@Injectable()
export class AboutService {
    getAboutText = () => getJSON<string>(`${Config.apiUrl}/NPAbout`);
}
