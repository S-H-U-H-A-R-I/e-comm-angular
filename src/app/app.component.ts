import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NavigationMenuComponent } from "./components/navigation-menu/navigation-menu.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationMenuComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {

}
