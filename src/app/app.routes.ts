import { Routes, CanActivate } from '@angular/router';
import { LandingView } from './public/views/landing/landing.view';
import { HomeView } from './private/views/home/home.view';
import { AuthGuardService as AuthGuard } from './core/guard/auth-guard';
export const routes: Routes = [
    {
        path: '',
        component: LandingView
    },
    {
        path: 'home',
        component: HomeView,
        canActivate: [AuthGuard] 
    },
    { path: '**', redirectTo: '' }
];
