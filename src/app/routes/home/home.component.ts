import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'

import type { Product } from '../../../types/types'

@Component({
    selector: 'home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home.component.html',
})
export class HomeComponent {
    products: Product[] = []

    constructor(private http: HttpClient) { }
}
