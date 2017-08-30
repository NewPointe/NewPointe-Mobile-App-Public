import { connectionType, getConnectionType, startMonitoring } from "connectivity";
import { getString, setString } from "application-settings";
import * as platform from "platform";

export class Config {

  static baseURL = "https://newpointe.org";

  static apiUrl = `${Config.baseURL}/api`;

  static eventsUrl = "https://newpointe.org/Assets/calendar.json"; // "https://api.serviceu.com/rest/events/occurrences?orgkey=<ORG_KEY>&format=json";
  static donateUrl = `${Config.baseURL}/GiveNow`;

  static liveAudioUrl = (
    platform.isIOS ?
      "https://yourstreamlive.com/audio/3598/hls" :
      "https://origin2-edge2.ord.yourstreamlive.com:443/live/yourstreamlive/out_3598_d2vwi4ex_audio/playlist.m3u8"
  ) + "?platform=" + encodeURIComponent(`App (Audio) - ${platform.device.os} ${platform.device.osVersion}`);

  static liveVideoUrl = (
    platform.isIOS ?
      "https://yourstreamlive.com/live/3598/hls" :
      "https://origin2-edge2.ord.yourstreamlive.com:443/live/yourstreamlive/amlst:out_3598_d2vwi4ex/playlist.m3u8"
  ) + "?platform=" + encodeURIComponent(`App - ${platform.device.os} ${platform.device.osVersion}`);


  static get SkipLogin(): string {
    return getString("SkipLogin");
  }
  static set SkipLogin(skipLogin: string) {
    setString("SkipLogin", skipLogin);
  }

}
