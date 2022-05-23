import recipes from '../data/recipes.js'
import Recipe from './recipe.js'

class Main {

  constructor() {
    
    const tags = ['ingredients', 'appliance', 'ustensils']
    
    this.recipes = recipes.map(recipe => new Recipe(recipe))

    this.filteredRecipes = [...this.recipes]

    this.searchTag = {}

    this.selectedElements = {}
    
    tags.forEach(tag => {

      this.selectedElements[tag] = []
      this.searchTag[tag] = ''
      this.internalIngredientsSearch(tag)

    })

    this.searchString = ''

    this.displayAllFilters()

    this.searchInputKeydown()
    

    this.displayRecipes()

    Object.keys(this.recipesEl).forEach(filter => this.addTitleListener(filter))

    this.internalIngredientsSearch
  }

  displayAllFilters(){

    this.recipesEl = this.filteredRecipes.reduce((acc, current) => {
      acc.ingredients.push(...current.ingredients.filter(ing => !acc.ingredients.includes(ing.ingredient)).map(ing => ing.ingredient))

      if(!acc.appliance.includes(current.appliance)){
        acc.appliance.push(current.appliance)
      }
      current.ustensils.forEach(ustensil => {
        if(!acc.ustensils.includes(ustensil)){
          acc.ustensils.push(ustensil)
        }
      })
      

      return acc
    }, {ingredients:[],appliance:[],ustensils:[]})

    //this.recipesEl.ingredients = this.recipesEl.ingredients.filter(ing => !this.selectedIngredient.includes(ing))

    Object.keys(this.recipesEl).forEach(filter => this.displayFilterTags(filter))

    Object.keys(this.recipesEl).forEach(filter => {
      this.recipesEl[filter] = this.recipesEl[filter].filter(ing => !this.selectedElements[filter].includes(ing))
      this.displayFilterTags(filter)
    })
  }

  displayFilterTags(filterName){

    const elSearchDiv = document.querySelector(`.${filterName}-container`)

    elSearchDiv.innerHTML = ""

    const filterUl = document.createElement('ul')

    filterUl.classList.add(`${filterName}-liste`)
 
    const matchedSearch = this.recipesEl[filterName].filter(testedCondition => testedCondition.toLowerCase().includes(this.searchTag[filterName]))


      
    matchedSearch.forEach(eachFiltered => {
      
      const condiFilterLi = document.createElement('li')
      condiFilterLi.classList.add(`${filterName}-item`)
      condiFilterLi.setAttribute('data-filter-type', filterName)
      condiFilterLi.innerText = eachFiltered

      condiFilterLi.addEventListener('click', this.tagClick.bind(this))

      filterUl.appendChild(condiFilterLi)

    })
    
    elSearchDiv.appendChild(filterUl)
  }

  displayRecipes() {
    const recipesCntr = document.getElementById('recipes')

    this.filteredRecipes = this.recipes.filter(recipe => recipe.checkMatchingFilters(this.searchString, this.selectedElements.ingredients, this.selectedElements.appliance, this.selectedElements.ustensils))
    
    recipesCntr.innerHTML = ''

    this.filteredRecipes.forEach(recipe => {
      recipesCntr.appendChild(recipe.generateDomRecipeEl())
    })

    this.displayAllFilters()
  }


  searchInputKeydown(){
    const searchInput = document.getElementById('recipe-search');

    searchInput.addEventListener('keyup',  (e) => {
      this.searchString = e.target.value.toLowerCase()
      console.log(this.searchString)
      this.displayRecipes()
    })
  }

  tagClick(e){

    const filterName = e.target.getAttribute('data-filter-type')

    const tagsDiv = document.querySelector(`.selected-${filterName}-buttons`)

    this.selectedElements[filterName].push(e.target.innerText)

    const tag = document.createElement('span')

    tag.classList.add(`selected-${filterName}`)

    tag.setAttribute('data-filter-type', filterName)

    tag.innerHTML = `${e.target.innerText} <i class="far fa-times-circle selected-${filterName}-remove"></i>`

    tag.addEventListener('click', this.removeTag.bind(this))

    tagsDiv.appendChild(tag)

    this.displayRecipes()

  }

  removeTag(e){

    const target = e.target.tagName.toLowerCase() === 'span' ? e.target : e.target.closest('span')

 

    console.log(target.innerText)
    const filterName = target.getAttribute('data-filter-type')

    const tagsDiv = document.querySelector(`.selected-${filterName}-buttons`)
    
    console.log(this.selectedElements[filterName])

    this.selectedElements[filterName] = this.selectedElements[filterName].filter(filter => target.innerText.trim() !== filter)

    tagsDiv.removeChild(target)

    console.log(this.selectedElements[filterName])
    this.displayAllFilters()
    this.displayRecipes()
  }

  internalIngredientsSearch(filterName){
    const searchField = document.getElementById(`${filterName}_search`)
    
    searchField.addEventListener('keydown', (e) => {

      this.searchTag[filterName] = e.target.value.toLowerCase()

      this.displayAllFilters()

    })
  }

  addTitleListener(filterName){

    

    const elSearchDiv = document.querySelector(`.${filterName}-container`)

    const filterTitle = document.querySelector(`.${filterName}FilterTitle`)

    const filterTitleDiv = document.querySelector(`.flex-title-${filterName}`)

    const elSearchFilter = document.getElementById(`${filterName}_search`)

    const chevronSearch = document.querySelector(`.${filterName}-chevron-up`)

    filterTitle.addEventListener('click', () => {
      elSearchDiv.style.display = getComputedStyle(elSearchDiv)['display'] === 'none'? 'block' : 'none'
      filterTitleDiv.style.display = 'none'
      elSearchFilter.style.display = 'flex'
      chevronSearch.style.display = 'flex'
    })

    chevronSearch.addEventListener('click', () =>{
      elSearchDiv.style.display = getComputedStyle(elSearchDiv)['display'] === 'none'? 'block' : 'none'
      filterTitleDiv.style.display = 'flex'
      elSearchFilter.style.display = 'none'
      chevronSearch.style.display = 'none'
    })

  }

}

const main = new Main()


