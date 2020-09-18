import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataStorageService } from "../data-storage.service";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "header.component.html"
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  private userSub: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuth = !user ? false : true;
    });
  }

  onSaveRecipes() {
    this.dataStorageService.saveRecipes();
  }

  onGetRecipes() {
    this.dataStorageService.getRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
