import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../../services/auth/auth.service";


export const ifAuthentication: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) 
    {    
        return true;
    }
    else 
    {
        router.navigate(['/auth']);
        return false;
    }
}