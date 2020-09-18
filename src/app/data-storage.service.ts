import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, tap, filter, first } from "rxjs/operators";

import { RecipeService } from "./recipes-folder/recipe.service";
import { Recipe } from "./recipes-folder/recipe.model";

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  saveRecipes() {
    const userData: {
      email: string;
      _token: string;
      _tokenExpirationDate: string;
      _userId: string;
    } = JSON.parse(localStorage.getItem("userData"));

    let recipesObj = {};
    const recipes = this.recipeService.getRecipes();
    recipes.forEach((item) => {
      let key = "";
      if (item.recipeId == "new") {
        key = this.generateUniqueId();
        item.recipeId = key;
      } else {
        key = item.recipeId;
      }
      recipesObj[key] = item;
    });

    this.http
      .patch(
        `https://recipe-book-68ac0.firebaseio.com/recipes.json`,
        recipesObj
      )
      .subscribe((response) => console.log(response));
  }

  saveRecipe(recipe: Recipe) {
    const userData: {
      email: string;
      _token: string;
      _tokenExpirationDate: string;
      _userId: string;
    } = JSON.parse(localStorage.getItem("userData"));

    let recipesObj = {};
    recipe.recipeId = this.generateUniqueId();
    recipe.userId = userData._userId;
    recipesObj[recipe.recipeId] = recipe;

    return this.http.patch(
      `https://recipe-book-68ac0.firebaseio.com/recipes.json`,
      recipesObj
    );
  }

  updateRecipe(recipeId: string, recipe: Recipe) {
    return this.http.patch(
      `https://recipe-book-68ac0.firebaseio.com/recipes/${recipeId}.json`,
      recipe
    );
  }

  deleteRecipe(recipeId: string) {
    return this.http.delete(
      `https://recipe-book-68ac0.firebaseio.com/recipes/${recipeId}.json`
    );
  }

  getRecipes() {
    const userData: {
      email: string;
      _token: string;
      _tokenExpirationDate: string;
      _userId: string;
    } = JSON.parse(localStorage.getItem("userData"));

    return this.http
      .get<Recipe[]>(
        `https://recipe-book-68ac0.firebaseio.com/recipes.json?orderBy="userId"&equalTo="${userData._userId}"`
      )
      .pipe(
        filter(this.isNotNull),
        map((recipes) => {
          return Object.keys(recipes).map((recipe) => {
            return {
              ...recipes[recipe],
              recipeId: recipe,
              ingredients: recipes[recipe].ingredients
                ? recipes[recipe].ingredients
                : [],
            };
          });
        }),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }

  getRecipeById(recipeId: string) {
    return this.http
      .get<Recipe>(
        `https://recipe-book-68ac0.firebaseio.com/recipes/${recipeId}.json`
      )
      .pipe(
        first(),
        map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        })
      );
  }

  isNotNull(input: null | undefined | Recipe[]) {
    return input != null && input != undefined;
  }

  private generateUniqueId() {
    // Modeled after base64 web-safe chars, but ordered by ASCII.
    const PUSH_CHARS =
      "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

    let lastPushTime = 0;

    let lastRandChars = [];

    let now = new Date().getTime();
    let duplicateTime = now === lastPushTime;
    lastPushTime = now;

    const timeStampChars = new Array(8);
    for (let i = 7; i >= 0; i--) {
      timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
      // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
      now = Math.floor(now / 64);
    }
    if (now !== 0)
      throw new Error("We should have converted the entire timestamp.");

    let id = timeStampChars.join("");

    if (!duplicateTime) {
      for (let i = 0; i < 12; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
      }
    } else {
      // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
      for (let i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
        lastRandChars[i] = 0;
      }
      //lastRandChars[i]++;
    }
    for (let i = 0; i < 12; i++) {
      id += PUSH_CHARS.charAt(lastRandChars[i]);
    }
    if (id.length != 20) throw new Error("Length should be 20.");

    return id;
  }
}
