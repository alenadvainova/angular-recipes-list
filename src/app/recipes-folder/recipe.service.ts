import { Recipe } from "./recipe.model";
import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shopping-list-folder/ingredient.model";
import { ShoppingListService } from "../shopping-list-folder/shoppingList.service";
import { DataStorageService } from "../data-storage.service";

@Injectable()
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  recipeItemSelectedEvnt = new EventEmitter<Recipe>();

  constructor(private shService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    //this.recipeChanged.next(this.recipes.slice());
  }

  getRecipe(recipeId: string) {
    return this.recipes.find((item) => item.recipeId == recipeId);
  }

  addToShoppingList(ingredients: Ingredient[]) {
    this.shService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    const userData: {
      email: string;
      _token: string;
      _tokenExpirationDate: string;
      _userId: string;
    } = JSON.parse(localStorage.getItem("userData"));

    recipe.userId = userData._userId;
    recipe.recipeId = "new";
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    const currRecipe = this.recipes[index];
    this.recipes[index] = {
      recipeId: currRecipe.recipeId,
      userId: currRecipe.userId,
      ...newRecipe,
    };
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    const currRecipe = this.recipes[index];
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }

  clearRecipes() {
    this.recipes = [];
  }

  updateRecipes() {
    this.recipes = [];
    this.recipeChanged.next(this.recipes.slice());
  }
}
