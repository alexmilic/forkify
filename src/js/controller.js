import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import recipeView from './ views/recipeView.js';
import searchView from './ views/searchView.js';
import resultsView from './ views/resultsView.js';
import paginationView from './ views/paginationView.js';
import bookmarksView from './ views/bookmarksView.js';
import addRecipeView from './ views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// if(module.hot) {
//     module.hot.accept();
// }

const controlRecipes = async function() {
    try {
        const id = window.location.hash.slice(1);
        
        if(!id) return;
        recipeView.renderSpinner();

        // update results view to mark selected result
        resultsView.update(model.getSearchResultsPage());

        // Update bookmarks view
        bookmarksView.update(model.state.bookmarks);
        
        // load recipe
        await model.loadRecipe(id);
        
        // render recipe
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
        resultsView.render(model.getSearchResultsPage());

        // 4) Render intial pagination buttons
        paginationView.render(model.state.search);
    } catch(error) {
        console.log(error);
    }
}

const controlPagination = function(goToPage) {
    // 1) render NEW results
    resultsView.render(model.getSearchResultsPage(goToPage));

    // 2) Render NEW pagination buttons
    paginationView.render(model.state.search);
}

const controlServings = function(newServings) {
    // Update the recipe servings (in state)
    model.updateServings(newServings);

    // Update the recipe view
    // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() {
    // Add/remove bookmark
    if(!model.state.recipe.bookmarked) {
        model.addBookmark(model.state.recipe);
    } else {
        model.deleteBookmark(model.state.recipe.id);
    }

    // Update recipe view
    recipeView.update(model.state.recipe);
    // console.log(model.state.recipe);

    // Render bookmarks
    bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
    bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
    try {
        // show loading spinner
        addRecipeView.renderSpinner();

        // upload recipe data
        await model.uploadRecipe(newRecipe);
        console.log(model.state.recipe);

        // render recipe
        recipeView.render(model.state.recipe);

        // success message
        addRecipeView.renderMessage();

        // Render bookmark view
        bookmarksView.render(model.state.bookmarks);

        // Change ID in th URL
        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        // close form window
        setTimeout(() => {
           addRecipeView.toggleWindow(); 
        }, MODAL_CLOSE_SEC * 1000);
    } catch(error) {    
        console.error(error);
        addRecipeView.renderErorr(error.message);
    }
}

const init = function() {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();