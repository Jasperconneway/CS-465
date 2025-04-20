import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/authresponse';
import { TripDataService } from './trip-data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {}

  public getToken(): string{
    let token: string = this.storage.getItem('travlr-token') as string;
    return token;
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  public login(user: User, passwd: string): Observable<any> {
    
    return this.tripDataService.login(user, passwd)
      .then((authResp: AuthResponse) =>
    this.saveToken(authResp.token));
  }

  public register(user: User, passwd: string): Observable<any> {
    return this.tripDataService.register(user, passwd)
      .then((authResp: AuthResponse) => 
      this.saveToken(authResp.token));
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  public getCurrentUser(): User {
    if (this.isLoggedIn()) {
      const token: string = this.getToken();
      const { email, name } = 
    JSON.parse(atob(token.split('.')[1]));
      return { email, name } as User;
    }
  }

}
