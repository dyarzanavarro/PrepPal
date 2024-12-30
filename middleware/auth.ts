import { getAuth } from 'firebase/auth';

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = getAuth();
    const user = auth.currentUser;

    console.log('Middleware executed', { user, path: to.path });

    if (!user && to.path !== '/login' && to.path !== '/welcome') {
        return navigateTo('/login');
    }
});