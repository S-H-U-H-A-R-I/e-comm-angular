import { Component, Input, OnInit, Renderer2 } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'icons',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './icons.component.html',
})
export class IconsComponent implements OnInit {
    @Input() category: 'info' | 'warning' | 'success' | 'error' = 'info'
    private observer!: MutationObserver
    isDark: boolean = false

    constructor(private renderer: Renderer2) {}

    ngOnInit() {
        const body = this.renderer.selectRootElement('body', true)
        this.isDark = body.classList.contains('dark')

        this.observer = new MutationObserver(() => {
            this.isDark = body.classList.contains('dark')
        })

        this.observer.observe(body, { attributes: true, attributeFilter: ['class'] })
    }

    ngOnDestroy() {
        this.observer.disconnect()
    }
}
