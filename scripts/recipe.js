import recipeTmpl from "../templates/recipeTmpl.js";

class Recipe {

  constructor(data = {name: "", servings: null, ingredients: [], time: null, description: "", appliance: "", ustensils: ""}){
    this.ingredients = data?.ingredients || []
    this.name = data?.name || ''
    this.servings = data?.servings || null
    this.time = data?.time || null
    this.description = data?.description || ''
    this.appliance = data?.appliance || ''
    this.ustensils = data?.ustensils || []
  }

  generateDomRecipeEl() {

    const domRecipe = document.createElement('div')
    domRecipe.classList.add('div-recipe')
    domRecipe.innerHTML = recipeTmpl
    domRecipe.querySelector('.name').innerText = this.name
    this.ingredients.forEach(ingredient => {
      const ingredientSpan = document.createElement('span')
      ingredientSpan.classList.add('ingredient')
      if(ingredient.unit){
        ingredientSpan.innerText = ingredient.ingredient + ": " + ingredient.quantity + " " + ingredient.unit
      }else{
        ingredientSpan.innerText = ingredient.ingredient + ": " + ingredient.quantity
      }
      domRecipe.querySelector('.ingredients-div').appendChild(ingredientSpan)
    })

    domRecipe.querySelector('.time').innerHTML = `<i class="far fa-clock"></i> ${this.time} minutes`
    domRecipe.querySelector('.description').innerText = this.description.substring(0, 160)
    domRecipe.querySelector('.name').innerText = this.name

    return domRecipe
  }


  checkMatchingFilters(filterSearch, filterIngredients, filterAppliance, filterUstensils){
    const matchingSearch = this.checkMatchingSearch(filterSearch)

    const matchingIngredients = this.checkMatchingIngredients(filterIngredients)

    const matchingAppliance = this.checkMatchingAppliance(filterAppliance)

    const matchingUstensils = this.checkMatchingUstensils(filterUstensils)

    return matchingAppliance && matchingIngredients && matchingSearch && matchingUstensils

  }

  checkMatchingIngredients(filterIngredients){

    let isMatchingIngredients = true

    if(filterIngredients && filterIngredients.length){
      for (let i = 0; i < filterIngredients.length; i++) {
        let toto = false
        const filterIngredient = filterIngredients[i].toLowerCase();
        
        for (let j = 0; j < this.ingredients.length; j++) {
          const ingredient = this.ingredients[j].ingredient.toLowerCase();

          toto = filterIngredient === ingredient || toto
        }
        isMatchingIngredients = toto && isMatchingIngredients
      }
    }

    return isMatchingIngredients 
  }
  checkMatchingAppliance(filterAppliance){

    let isMatchingAppliance = true

    if(filterAppliance && filterAppliance.length){
      
      for (let i = 0; i < filterAppliance.length; i++) {

        const filterAppliances = filterAppliance[i].toLowerCase()
        
        const matchingAppliance = this.appliance.toLowerCase().includes(filterAppliances)

        isMatchingAppliance = matchingAppliance
      }
    }
  return isMatchingAppliance
  }

  checkMatchingUstensils(filterUstensils){

    let isMatchingUstensils = true

    if(filterUstensils && filterUstensils.length){
      
      for (let i = 0; i < filterUstensils.length; i++) {

        
        let toto = false

        const mappedUstensils = filterUstensils[i].toLowerCase();

        for (let j = 0; j < this.ustensils.length; j++) {

          const ustensils = this.ustensils[j].toLowerCase();

          toto = mappedUstensils === ustensils || toto

        }

        isMatchingUstensils = toto && isMatchingUstensils
      }
    }

    return isMatchingUstensils
}

  checkMatchingSearch(filterSearch){

    const isMatchingName = this.name.toLowerCase().includes(filterSearch.toLowerCase())
    const isMatchingDescription = this.description.toLowerCase().includes(filterSearch.toLowerCase())
    const isMatchingServings = this.servings?.toString()?.includes(filterSearch)
    const isMatchingTime = this.time?.toString()?.includes(filterSearch)
    const isMatchingAppliance = this.appliance.toLowerCase().includes(filterSearch.toLowerCase())

    let isMatchingIngredients = this.ingredients.filter(ing => ing.ingredient.toLowerCase().includes(filterSearch.toLowerCase())).length > 0
        
    let isMatchingUstensils = this.ustensils.filter(ust => ust.toLowerCase().includes(filterSearch.toLowerCase())).length > 0
    
    return isMatchingName || 
           isMatchingDescription ||
           isMatchingServings ||
           isMatchingTime ||
           isMatchingAppliance ||
           isMatchingIngredients ||
           isMatchingUstensils
  }


}

export default Recipe

