import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { env } from '../../../environments/environment'

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [],
    templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
    message = ''

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.getMessage()
    }

    getMessage() {
        this.http.get<{ message: string }>(`${env.api}`)
            .subscribe(res => this.message = res.message)
    }
}
