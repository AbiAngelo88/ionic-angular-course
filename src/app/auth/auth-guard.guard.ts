import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import {  CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// E' un servizio che si lega alle routes
export class AuthGuardGuard implements CanLoad {

  constructor(private authService: AuthService, private router: Router) {}

  /** Si aziona prima del lazyLoading nelle routes */
  canLoad(
    route: Route,
    segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
      if(!this.authService.userIsAuthenticated) {
        this.router.navigateByUrl('/auth');
      }
      return this.authService.userIsAuthenticated;
  }
  /*
  * Implementare l'interfaccia CanActivate non è molto appropriato nel caso di lazyLoading in quanto
    comunque un modulo verrebbe caricato prima dell'attivazione del metodo canActivate del guard */

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
  //   throw new Error("Method not implemented.");
  // }
}
