import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError, BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

import { User } from "./user.model";

import { RecipeService } from "../recipes-folder/recipe.service";
import { ShoppingListService } from "../shopping-list-folder/shoppingList.service";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private recipeService: RecipeService,
    private shService: ShoppingListService
  ) {}

  signup(email: string, password: string, firstName: string, lastName: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAQaCXzGqTOYhM-IYcBkZNVDKUkIOMOkWI",
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuth(
            resData.email,
            resData.idToken,
            +resData.expiresIn,
            resData.localId
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAQaCXzGqTOYhM-IYcBkZNVDKUkIOMOkWI",
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuth(
            resData.email,
            resData.idToken,
            +resData.expiresIn,
            resData.localId
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      _token: string;
      _tokenExpirationDate: string;
      _userId: string;
    } = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate),
      userData._userId
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);

      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(["/auth/login"]);
    localStorage.removeItem("userData");
    this.recipeService.clearRecipes();
    this.shService.clearIngredients();
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMsg = "An unknown error occurred!";
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMsg);
    }
    switch (errorRes.error.error.message) {
      case "EMAIL_EXISTS":
        errorMsg = "The email already exists";
        break;
      case "EMAIL_NOT_FOUND":
        errorMsg = " This email does not exist!";
        break;
      case "INVALID_PASSWORD":
        errorMsg = " The password is not correct!";
        break;
    }

    return throwError(errorMsg);
  }

  private handleAuth(
    email: string,
    token: string,
    expiresIn: number,
    userId: string
  ) {
    const tokenExpirationDate = new Date(
      new Date().getTime() + expiresIn * 1000
    );
    const user = new User(email, token, tokenExpirationDate, userId);
    this.autoLogout(expiresIn * 1000);

    this.user.next(user);

    localStorage.setItem("userData", JSON.stringify(user));
  }
}
