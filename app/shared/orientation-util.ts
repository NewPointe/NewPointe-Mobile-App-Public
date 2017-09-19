
import * as utils from 'utils/utils';
import * as app from 'application';
import { DeviceOrientation } from 'ui/enums';

declare var UIDevice, UIDeviceOrientation, UIApplication, java;

export function getOrientation() {
    if (app.ios) {

        var device = utils.ios.getter(UIDevice, UIDevice.currentDevice);

        switch (device.orientation) {
            case UIDeviceOrientation.UIDeviceOrientationLandscapeRight:
            case UIDeviceOrientation.UIDeviceOrientationLandscapeLeft:
                return DeviceOrientation.landscape;
            case UIDeviceOrientation.UIDeviceOrientationPortraitUpsideDown:
            case UIDeviceOrientation.UIDeviceOrientationPortrait:
                return DeviceOrientation.portrait;
            default:
                // Since we have a up/Down orientation, we need to see what the statusbar is set to to get the actual current device orientation
                var appOrientation = utils.ios.getter(UIApplication, UIApplication.sharedApplication).statusBarOrientation;
                if (appOrientation === 1 || appOrientation === 2) {
                    return DeviceOrientation.portrait;
                }
                else {
                    return DeviceOrientation.landscape;
                }
        }
    }
    else if (app.android) {

        switch (getContext().getSystemService("window").getDefaultDisplay().getRotation()) {
            case 1: // 90°  LANDSCAPE
            case 3: // 270° LANDSCAPE
                return DeviceOrientation.landscape;
            case 0: // 0°   PORTRAIT
            case 2: // 180° PORTRAIT
                return DeviceOrientation.portrait;
        }
    }
    return DeviceOrientation.unknown;
}


function getContext() {
    var ctx = java.lang.Class.forName("android.app.AppGlobals").getMethod("getInitialApplication", null).invoke(null, null);
    if (ctx) { return ctx; }

    return java.lang.Class.forName("android.app.ActivityThread").getMethod("currentApplication", null).invoke(null, null);
}