import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm: FormGroup;
    error: string = '';
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.error = '';
            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    this.router.navigate(['/login']);
                },
                error: (err: any) => {
                    console.error('Registration failed:', err);
                    if (err.error && typeof err.error === 'string') {
                        this.error = err.error;
                    } else if (err.error && err.error.message) {
                        this.error = err.error.message;
                    } else {
                        this.error = 'Registration failed. Please try again.';
                    }
                    this.isLoading = false;
                }
            });
        }
    }
}
