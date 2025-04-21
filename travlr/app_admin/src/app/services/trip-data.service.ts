import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Trip } from '../models/trip';
import { AuthResponse } from '../models/authresponse';
import { BROWSER_STORAGE } from '../storage';



@Injectable({
  providedIn: 'root'
})

export class TripDataService {

  constructor(private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage) {}

  apiBaseUrl = 'http://localhost:3000/api/';
  tripUrl = `${this.apiBaseUrl}trips`;


  getTrips() : Observable<Trip[]> {
    // console.log('Inside TripDataService::getTrips');
    return this.http.get<Trip[]>(this.tripUrl);
  }

  addTrip(formData: Trip) : Observable<Trip> {
        // console.log('Inside TripDataService::addTrips');
    return this.http.post<Trip>(this.tripUrl, formData);
  }

  getTrip(tripCode: string) : Observable<Trip[]> {
    // console.log('Inside TripDataService::getTrips');
    return this.http.get<Trip[]>(this.tripUrl + '/' + tripCode);
  }

  updateTrip(formData: Trip) : Observable<Trip> {
    // console.log('Inside TripDataService::addTrips');
    return this.http.put<Trip>(this.tripUrl + '/' + formData.code, formData);
  }

  // Call to our /login endpoint, returns JWT
  login(user: User) : Promise<AuthResponse> {
    // console.log('Inside TripDataService::login');
    return this.handleAuthAPICall('login', user);
  }

  register(user: User) : Promise<AuthResponse> {
    // console.log('Inside TripDataService::register');
    return this.handleAuthAPICall('register', user);
  }

  handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }
  
  handleAuthAPICall(urlPath: string, user: User) : Promise<AuthResponse> {
    // console.log('Inside TripDataService::handleAuthAPICall');
    const url: string = `${this.apiBaseUrl}/${urlPath}`; 
    return this.http 
      .post(url, user) 
      .toPromise() 
      .then(response => response as AuthResponse) 
      .catch(this.handleError); 
  }
}
