import { getAuth, onAuthStateChanged } from "firebase/auth";

export default defineNuxtRouteMiddleware(async (to) => {
    const auth = getAuth();
    const user = await new Promise((resolve) =>
        onAuthStateChanged(auth, (currentUser) => resolve(currentUser))
    );

    // Redirect from `/` to `/welcome`
    if (!user && to.path === "/") {
        return navigateTo("/welcome");
    }

    // Block unauthorized access to other routes except `/welcome` and `/login`
    if (!user && to.path !== "/login" && to.path !== "/welcome") {
        return navigateTo("/login");
    }
});
