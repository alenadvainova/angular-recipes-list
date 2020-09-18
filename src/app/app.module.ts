import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthRoutingModule } from "./auth/auth-routing.module";
import { HeaderComponent } from "./header/header.component";
import { RecipesComponent } from "./recipes-folder/recipes/recipes.component";
import { RecipeListComponent } from "./recipes-folder/recipe-list/recipe-list.component";
import { RecipeDetailComponent } from "./recipes-folder/recipe-detail/recipe-detail.component";
import { RecipeItemComponent } from "./recipes-folder/recipe-item/recipe-item.component";
import { ShoppingListComponent } from "./shopping-list-folder/shopping-list/shopping-list.component";
import { ShoppingListEditComponent } from "./shopping-list-folder/shopping-list-edit/shopping-list-edit.component";
import { DropdownDirective } from "./directive/dropdown.directive";
import { ShoppingListService } from "./shopping-list-folder/shoppingList.service";
import { RecipeStartComponent } from "./recipes-folder/recipe-start/recipe-start.component";
import { RecipeEditComponent } from "./recipes-folder/recipe-edit/recipe-edit.component";
import { RecipeService } from "./recipes-folder/recipe.service";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { AlertComponent } from "./alert/alert.component";
import { PlaceholderDirective } from "./directive/placeholder.directive";
import { MessageComponent } from "./auth/message/message.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    ShoppingListComponent,
    ShoppingListEditComponent,
    DropdownDirective,
    RecipeStartComponent,
    RecipeEditComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    ShoppingListService,
    RecipeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
