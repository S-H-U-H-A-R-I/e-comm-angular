import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

import { IconsComponent } from '../icons/icons.component'

@Component({
    selector: 'toast',
    standalone: true,
    imports: [CommonModule, IconsComponent],
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
    @Input() message: string = ''
    @Input() category: 'info' | 'warning' | 'success' | 'error' = 'info'

    get categoryClass() {
        return {
            'info': this.category === 'info',
            'warning': this.category === 'warning',
            'success': this.category === 'success',
            'error': this.category === 'error'
        }
    }
}
