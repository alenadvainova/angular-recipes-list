import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { DataStorageService } from "src/app/data-storage.service";

import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

@Component({
  selector: "app-recipe-detail",
  templateUrl: "./recipe-detail.component.html",
  styleUrls: ["./recipe-detail.component.css"],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: string;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      if (this.recipeService.getRecipes().length === 0) {
        this.dataStorageService.getRecipeById(this.id).subscribe((recipe) => {
          this.recipe = recipe;
        });
      } else {
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    });
  }

  onAddToShoppingList() {
    this.recipeService.addToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(["../", this.id, "edit"], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.dataStorageService
      .deleteRecipe(this.id)
      .subscribe((response) => this.recipeService.updateRecipes());
    this.router.navigate(["/recipes"]);
  }
}
