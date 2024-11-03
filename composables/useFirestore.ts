// composables/useFirestore.ts
import { addDoc, collection, getFirestore, doc, getDoc } from "firebase/firestore";
import { ref } from "vue";

export const useFirestore = () => {
    const firestore = getFirestore();
    const recipesCollection = collection(firestore, "recipes");

    const addRecipe = async (recipeData: {
        id: string;
        title: string;
        link: string;
        category: string;
        duration: number;
        rating: number;
        image: string;
        slug: string;
    }) => {
        try {
            await addDoc(recipesCollection, recipeData);
            return { success: true };
        } catch (error) {
            console.error("Error adding recipe:", error);
            return { success: false, error };
        }
    };


    const getRecipeBySlug = async (slug: string) => {
        try {
            const recipeDoc = await getDoc(doc(recipesCollection, slug));
            if (recipeDoc.exists()) {
                return recipeDoc.data();
            } else {
                console.error("No such recipe found!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching recipe:", error);
            return null;
        }
    };

    return { addRecipe, getRecipeBySlug };
};
