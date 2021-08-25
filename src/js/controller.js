import * as model from './model.js';
import recipeView from './ views/recipeView.js';
import searchView from './ views/searchView';
import resultsView from './ views/resultsView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

if(module.hot) {
    module.hot.accept();
}

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
       recipeView.renderErorr();
    }
}

const controlSearchResults = async function() {
    try {
        resultsView.renderSpinner();
        
        // 1) Get search query
        const query = searchView.getQuery();
        if(!query) return;

        // 2) Load search results
        await model.loadSearchResults(query);

        // 3) render results
        // console.log(model.state.search.results);
        resultsView.render(model.state.search.results);

    } catch(error) {
        console.log(error);
    }
}

const init = function() {
    recipeView.addHandlerRender(controlRecipes);
    searchView.addHandlerSearch(controlSearchResults);
}
init();