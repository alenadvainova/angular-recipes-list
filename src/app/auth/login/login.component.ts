import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService, AuthResponseData } from "../auth.service";
import { MessageService } from "../message.service";

@Component({
  selector: "app-auth-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent {
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

    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;
    authObs = this.authService.login(email, password);
    authObs.subscribe(
      (response) => {
        this.isLoading = false;
        this.router.navigate(["/recipes"]);
        form.reset();
      },
      (errorMsg) => {
        this.messageService.setMessage(errorMsg);
        this.isLoading = false;
      }
    );
  }
}
