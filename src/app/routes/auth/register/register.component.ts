import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Observable } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

import { ToastComponent } from '@app/components/toast/toast.component'
import { AuthService } from '@app/services/auth.service'

type category = 'info' | 'warning' | 'success' | 'error'

type ToastMessage = {
    idx: number
    text: string, 
    category: category,
    timeoutId?: ReturnType<typeof setTimeout>
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, ToastComponent, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    animations: [
        trigger('loadingState', [
            state('loading', style({ opacity: 0.5 })),
            state('loaded', style({ opacity: 1 })),
            transition('loading <=> loaded', animate('300ms ease-in-out'))
        ]),
        trigger('toastAnimation', [
            transition(':enter', [
                style({ transform: 'translateX(120%)', opacity: 0 }),
                animate('300ms ease-in', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('300ms ease-out', style({ transform: 'translateX(120%)' }))
            ])
        ])
    ]
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup
    errors: { [key: string]: string | null } = { name: null, email: null }
    loading = false
    toastMessages: ToastMessage[] = []
    private toastIndex = 0
    otp = false

    constructor(private fb: FormBuilder, private authService: AuthService) {
        this.registerForm = this.createForm()
    }

    private createForm(): FormGroup {
        return this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
        })
    }

    ngOnInit() {
        this.registerForm.valueChanges.subscribe(() => this.validateForm())
    }

    private validateForm() {
        this.resetErrors()
        const { name, email } = this.registerForm.controls
        this.errors['name'] = name.invalid ? 'Name is required' : null
        this.errors['email'] = email.invalid ? (email.errors?.['required'] ? 'Email is required' : 'Invalid email format') : null 
    }

    private resetErrors() {
        this.errors = { name: null, email: null }
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.loading = true
            this.registerUser(this.registerForm.value).subscribe({
                next: (res) => this.handleSuccess(res.message),
                error: () => this.handleError()
            })
        }
    }

    private registerUser({ name, email }: { name: string, email: string }): Observable<any> {
        return this.authService.register(name, email).pipe(
            map(res => res),
            catchError(err => {
                this.addToast(err.error.detail, 'error')
                this.loading = false
                throw err
            })
        )
    }

    private handleSuccess(message: string) {
        this.addToast(message, 'success')
        this.loading = false
    }

    private handleError() {
        this.loading = false
    }

    private addToast(message: string, category: category) {
        const newToast: ToastMessage = { text: message, category, idx: this.toastIndex++ }
        this.toastMessages.push(newToast)
        this.autoDismissToast(newToast.idx)
    }

    onToastClick(idx: number) {
        this.dismissToast(idx)
    }

    private autoDismissToast(idx: number) {
        const toast = this.toastMessages.find(t => t.idx === idx)
        if (toast) {
            const timeoutId = setTimeout(() => {
                this.dismissToast(idx)
            }, 4000)
            toast.timeoutId = timeoutId
        }
    }

    private dismissToast(idx: number) {
        const toastIndex = this.toastMessages.findIndex(t => t.idx === idx)
        if (toastIndex !== -1 ) {
            clearTimeout(this.toastMessages[toastIndex].timeoutId)
            this.toastMessages.splice(toastIndex, 1)
        }
    }

    isFormInvalid(): boolean {
        return this.registerForm.invalid || !!this.errors['name'] || !!this.errors['email']
    }
}
