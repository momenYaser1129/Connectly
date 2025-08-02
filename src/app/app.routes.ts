import { Routes } from '@angular/router';
import { TimelineComponent } from './components/timeline/timeline.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { loggedGuard } from './guards/logged.guard';
import { authGuard } from './guards/auth.guard';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { MypostsComponent } from './components/myposts/myposts.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [loggedGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: '',
    component: BlankLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'timeline', pathMatch: 'full' },
      { path: 'timeline', component: TimelineComponent },
      { path: 'my-posts',loadComponent: () => import('./components/myposts/myposts.component').then(m => m.MypostsComponent) },
      { path: 'profile-settings', loadComponent: () => import('./components/profile-settings/profile-settings.component').then(m => m.ProfileSettingsComponent) },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
