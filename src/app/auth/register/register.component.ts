import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService, AuthResponseData } from "../auth.service";
import { MessageService } from "../message.service";

@Component({
  selector: "app-auth-register",
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  error: string = null;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    const firstName = form.value.firstName;
    const lastName = form.value.lastName;

    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;
    authObs = this.authService.signup(email, password, firstName, lastName);
    authObs.subscribe(
      (response) => {
        this.isLoading = false;
        form.reset();
        this.router.navigate(["/recipes"]);
      },
      (errorMsg) => {
        this.messageService.setMessage(errorMsg);
        this.isLoading = false;
      }
    );
  }
}
