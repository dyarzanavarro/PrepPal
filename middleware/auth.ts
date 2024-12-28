import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useFirebaseAuth } from "vuefire";

const auth = useFirebaseAuth()!;

export default defineNuxtRouteMiddleware((to, from) => {
    const user = auth.currentUser;
    if (!user && to.path !== '/login') {
        return navigateTo('/login');
    }
});