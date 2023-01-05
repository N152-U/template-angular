import { EventEmitter, Injectable, isDevMode, Output } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserModel } from '../../models/user/user.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { NgxRolesService,NgxPermissionsService } from 'ngx-permissions';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { data } from 'jquery';
const OPTIONS = {
  reportProgress: true,
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const helper = new JwtHelperService();
@Injectable()
export class AuthService {
  @Output() getUserLoggedInData: EventEmitter<any> = new EventEmitter();
  hasUser = false;
  checkAuth = setInterval(()=>{null},0);
  /*   const options= {
    headers?: HttpHeaders | {[header: string]: string | string[]},
    observe?: 'body' | 'events' | 'response',
    params?: HttpParams|{[param: string]: string | string[]},
    reportProgress?: boolean,
    responseType?: 'arraybuffer'|'blob'|'json'|'text',
    withCredentials?: boolean,
  } */
  constructor(private http: HttpClient, private router: Router, private rs:NgxRolesService, private ps:NgxPermissionsService) {
    //this.getToken();
  }
  getLoggedUserPermissions(username): Observable<any>{
    
    return this.http.get(`${environment.apiUrl}user/${username}/permissions`, OPTIONS).pipe(tap(data=>{
     
      return data;
    }),
    catchError((err: HttpErrorResponse) => {
      return throwError(err);
    }))
  }

  isAuth() {
    //Token decodificado
    const decodedToken = this.getTokenData();
    
    
    if (decodedToken) {
      this.getUserLoggedInData.emit(decodedToken);
      this.hasUser = true;
      //Hacemos la carga del rol con sus respectivos permisos
        //Rol y permisos provenientes desde la base de datos
        this.getLoggedUserPermissions(decodedToken.username).subscribe((data)=>{
         
        this.rs.addRoleWithPermissions(data.payload.role, data.payload.permissions);
        });
        
    } else {
      this.getUserLoggedInData.emit();
      this.hasUser = false;
    }
    return this.hasUser;
  }
  saveToken(data) {
    let successfullySavedToken=false;
    const encodedToken = data.payload;
    //Hace falta que regrese los demas datos
    localStorage.setItem('token', encodedToken);
    if (this.getTokenData()) {
      successfullySavedToken=true;
    }
    return successfullySavedToken;
  }
  getTokenData() {
    let decodedToken;
    //Validamos el tiempo de expiracion del token
    if (localStorage.getItem('token')) {
      const encodedToken = localStorage.getItem('token');
      //Decodificacion del token
      decodedToken = helper.decodeToken(encodedToken);
      const timeRemaningJWT =
        decodedToken.exp - Math.floor(new Date().getTime() / 1000.0);
      if (timeRemaningJWT <= 0) {
        localStorage.removeItem('token');
        decodedToken = null;
      }
    } else {
      decodedToken = null;
    }
    return decodedToken;
  }
  logIn(user: UserModel) {
    if(isDevMode())console.log(window.location.hostname);
    return this.http
      .post(`${environment.apiUrl}user/login`, JSON.stringify(user), OPTIONS)
      .pipe(tap(data=>{
        this.saveToken(data);
        clearInterval(this.checkAuth);
        this.checkAuth=setInterval(() => {
         this.isAuth()
        }, 10000);
      }))
  }
  logOut() {
    let successfullyRemovedToken = false;
    this.rs.flushRolesAndPermissions();
    localStorage.removeItem('token');
    if (localStorage.getItem('token') === null) {
      successfullyRemovedToken = true;
      clearInterval(this.checkAuth);
      this.router.navigateByUrl('/login');
    }
    return successfullyRemovedToken;
  }
}