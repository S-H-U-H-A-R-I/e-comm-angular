import { Component, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, Router, NavigationEnd } from '@angular/router'

import { navData } from '@lib/nav-menu-data'
import { Subscription } from 'rxjs'

@Component({
    selector: 'navigation-menu',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './navigation-menu.component.html',
})
export class NavigationMenuComponent implements OnInit, OnDestroy {
    isDarkTheme = false
    navData = navData
    filteredNavData: { name: string, link: string }[] = []
    private routerSubscription: Subscription = new Subscription()

    constructor(private router: Router) { }

    ngOnInit() {
        this.isDarkTheme = localStorage.getItem('isDarkTheme') === 'true'
        this.updateBodyClass()
        this.filterNavData()
        this.routerSubscription = this.router.events.subscribe(e => {
            if (e instanceof NavigationEnd) this.filterNavData()
        })
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe()
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme
        document.body.classList.toggle('dark', this.isDarkTheme)
        localStorage.setItem('isDarkTheme', String(this.isDarkTheme))
    }

    private updateBodyClass() {
        document.body.classList.toggle('dark', this.isDarkTheme)
    }

    filterNavData() {
        const currentPath = this.router.url
        this.filteredNavData = this.navData.filter(item => item.link !== currentPath)
    }
}
