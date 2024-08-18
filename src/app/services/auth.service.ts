import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs'
import { env } from '@environments/environment'

@Injectable({ providedIn: 'root' })
export class AuthService {
    private userSubject = new BehaviorSubject<any>(null)
    user$ = this.userSubject.asObservable()

    constructor(private http: HttpClient) { }

    register(name: string, email: string) {
        return this.http.post(`${env.api}/auth/register`, { name, email })
    }

    login(email: string, otp: string) {
        return this.http.post(`${env.api}/auth/login`, { email, otp })
    }

    logout(token: string) {
        return this.http.post(`${env.api}/auth/logout`, { token })
    }

    isLoggedIn() {
        return !!this.userSubject.value
    }
}

