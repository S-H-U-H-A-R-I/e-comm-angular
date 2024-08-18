import { Routes } from '@angular/router'
import { HomeComponent } from './routes/home/home.component'
import { AdminComponent } from './routes/admin/admin.component'
import { RegisterComponent } from './routes/auth/register/register.component'

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    }
]
