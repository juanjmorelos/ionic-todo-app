import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePage } from './presentation/pages/home/home.page';
import { AddTaskPage } from './presentation/pages/addTask/addTask.page';
import { ManageCategoryPage } from './presentation/pages/manageCategory/manageCategory.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'addTask',
    component: AddTaskPage,
  },
  {
    path: 'manageCategory',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: 'manageCategory/:categoryId',
    component: ManageCategoryPage,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
