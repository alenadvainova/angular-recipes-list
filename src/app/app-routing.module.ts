import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { RecipesComponent } from "./recipes-folder/recipes/recipes.component";
import { ShoppingListComponent } from "./shopping-list-folder/shopping-list/shopping-list.component";
import { RecipeStartComponent } from "./recipes-folder/recipe-start/recipe-start.component";
import { RecipeDetailComponent } from "./recipes-folder/recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipes-folder/recipe-edit/recipe-edit.component";
import { RecipeResolverService } from "./recipes-folder/recipe-resolver.service";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";
import { RegisterComponent } from "./auth/register/register.component";

const authModule = () => import("./auth/auth.module").then((x) => x.AuthModule);

const appRoutes: Route[] = [
  { path: "", redirectTo: "/recipes", pathMatch: "full" },
  {
    path: "recipes",
    component: RecipesComponent,
    canActivate: [AuthGuard],
    resolve: [RecipeResolverService],
    children: [
      { path: "", component: RecipeStartComponent },
      { path: "new", component: RecipeEditComponent },
      {
        path: ":id",
        component: RecipeDetailComponent,
        //resolve: [RecipeResolverService],
      },
      {
        path: ":id/edit",
        component: RecipeEditComponent,
        //resolve: [RecipeResolverService],
      },
    ],
  },
  { path: "shopping-list", component: ShoppingListComponent },
  { path: "auth", loadChildren: authModule },
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
