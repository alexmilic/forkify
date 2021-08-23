import * as model from './model.js';
import recipeView, { RecipeView } from './ views/recipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function() {
    try {
        const id = window.location.hash.slice(1);
        if(!id) return;

        recipeView.renderSpinner();
        // 1) load recipe
        await model.loadRecipe(id);

        // 2) render recipe
        recipeView.render(model.state.recipe);

    } catch (error) {
        alert(error);
    }
}

window.addEventListener('load', controlRecipes);
window.addEventListener('hashchange', controlRecipes);