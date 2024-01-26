import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ProtectRoutesGuard implements CanActivateChild {
  constructor(
    private router: Router
  ) { }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let sercretkey = localStorage.getItem('secretKey');

    if (sercretkey == environment.SECRET_KEY) {
      return true;
    } else {
      this.router.navigate(['']);
      return true;
    }
  }

}
