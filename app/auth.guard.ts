import { Injectable } from "@angular/core";
import { Router, CanActivate } from '@angular/router';
import { AuthService } from "./services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) { }

    canActivate() {
        if (this.authService.getUserToken()) {
            return true;
        }
        else {
            this.router.navigate(["/login"]);
            return false;
        }
    }
}

@Injectable()
export class InverseAuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) { }

    canActivate() {
        return !this.authService.getUserToken();
    }
}

