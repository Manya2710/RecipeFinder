import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); 
  const [showPopup, setShowPopup] = useState(false); 

  const fetchRecipes = async () => {
    if (!query) return;
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await res.json();
    setRecipes(data.meals || []);
  };

  const fetchIngredients = (meal) => {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure} ${ingredient}`);
      }
    }
    return ingredients;
  };

  const openPopup = (recipe) => {
    setSelectedRecipe(recipe);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedRecipe(null);
  };

  return (
    <div>
    <div className={`min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4 ${showPopup ? "blur-sm" : ""}`}>
      <h1 className="text-4xl font-bold text-center mb-6 text-red-700">
        Recipe Finder App
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search for recipes..."
          className="px-4 py-2 w-80 border rounded shadow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchRecipes()}
        />
        <button
          onClick={fetchRecipes}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.length === 0 && (
          <p className="text-center text-gray-600 col-span-full">
            No recipes found.
          </p>
        )}
        {recipes.map((recipe) => (
          <div
            key={recipe.idMeal}
            className="bg-white rounded shadow-lg overflow-hidden cursor-pointer"
            onClick={() => openPopup(recipe)}
          >
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-red-700">
                {recipe.strMeal}
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                Category: {recipe.strCategory} | Region: {recipe.strArea}
              </p>
              <a
                href={recipe.strYoutube}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline"
              >
                Watch on YouTube
              </a>
            </div>
          </div>
        ))}
      </div>
      </div>

      {showPopup && selectedRecipe && (
        <div className="fixed top-1/12 left-1/3 flex items-center justify-center ">
          <div className="z-5 bg-white rounded-lg p-10 max-w-2xl relative overflow-y-auto max-h-[80vh]">
            <button
              className="absolute top-2 right-2 text-gray-500 text-xl"
              onClick={closePopup}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2 text-red-700">{selectedRecipe.strMeal}</h2>
            <img
              src={selectedRecipe.strMealThumb}
              alt={selectedRecipe.strMeal}
              className="w-full rounded mb-4"
            />
            <h3 className="text-lg font-semibold mb-1">Ingredients:</h3>
            <ul className="list-disc list-inside mb-4">
              {fetchIngredients(selectedRecipe).map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mb-1">Instructions:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{selectedRecipe.strInstructions}</p>
          </div>
         </div> 
      )}
    </div>
  );
}

export default App;
