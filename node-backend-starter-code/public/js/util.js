// The block comment, below, is a JSDoc comment. JSDoc is great because it has
// an API that developers use with document generators to automatically create
// nice documentation for their code.
//
// If you've looked up JavaScript documentation online, it was probably
// generated with a JSDoc comment.

/**
 * Search OMDb for a movie by its title.
 *
 * @async
 * @param {string} title - The movie to search for.
 * @return {Promise<string>} The JSON response with search results.
 */
async function searchOMDb(title) {
  // We'll append the required 's' parameter (see OMDb API docs) to this url
  // in order to complete the request 
  const url = 'http://www.omdbapi.com/?apikey=2b129ac0&type=movie&s=';

  // Since we use the async keyword in our function definition, we can use the
  // await keyword, here.
  //
  // Remember -- regular functions can't use the await keyword!
  const res = await fetch(url + title);

  if (res.status === 200) {
    return res.json();
  }

  // If our status is anything except 200, throw an error
  throw new Error(res.status);
}


/**
 * Render the results of OMDb search as a list of movie titles. Users can click
 * on a movie title to see detailed info about that movie
 *
 * @param {Array} movies - An array of movies. 
 * @param {HTMLUListELement} container - Element to render movies in.
 * @param {HTMLElement} detailsDiv - Element to render movie details in.
 * @param {boolean} atFavesPage - True if this is being used at favorites.html
 */
function renderMovies(movies, container, detailsDiv, atFavesPage=false) {
  // If you're wondering if atFavesPage is a hack because I realized I hadn't
  // made showMovieDetails page-agnostic -- you're right :P
  
  // Clear previous search results, if any.
  destroyAllChildren(container);

  movies.forEach(movie => {
    const titleButton = makeBtn(movie.Title);

    // Attach event handler to the movie title button. When users click it,
    // they'll see detailed info about the movie.
    titleButton.onclick = e => {
      e.preventDefault();

      showMovieDetails(detailsDiv, movie, atFavesPage);
    };

    container.appendChild(makeLi(titleButton));
  });
}


/**
 * Show details of a movie in the specified element. 
 *
 * @param {Element} container - The element to hold movie details.
 * @param {Object} movie - The movie.
 * @param {boolean} atFavesPage - True if this is being used at favorites.html
 */
function showMovieDetails(container, movie, atFavesPage) {
  // Clear previous search results, if any.
  destroyAllChildren(container);

  container.appendChild(makeUlFrmObj(movie));

  // Also make a button to add a movie to favorites.
  if (!faves) {
    container.appendChild(makeLi(makeFavBtn(movie)));
  }
}


/**
 * Return a HTML button element.
 *
 * @param {string} text - The button text.
 * @return {HTMLButtonElement} button - The button element.
 */
function makeBtn(text) {
  const button = document.createElement('button');

  button.appendChild(document.createTextNode(text));
  return button;
}


/**
 * Return a HTML li element.
 *
 * @param {Node} [child=null] - The child of the li element. 
 * @return {HTMLLIElement} li - The li element.
 */
function makeLi(child=null) {
  const li = document.createElement('li');

  if (child) {
    li.appendChild(child);
  }

  return li;
}


/**
 * Return a button to send an object to the favorites route.
 *
 * @param {Object} obj - The object to add to favorites.
 * @return {HTMLButtonElement} button - The favorite button.
 */
function makeFavBtn(obj) {
  const button = makeBtn('Add to Favorites');

  button.onclick = e => {
    e.preventDefault();
    
    sendJsonTo('/favorites', obj);
  };

  return button;
}


/**
 * Return an HTML ul element that takes an object and lists the name of its
 * properties and their values.
 *
 * @param {Object} obj - The object.
 * @return {HTMLUListELement} ul - The ul element.
 */
function makeUlFrmObj(obj) {
  const ul = document.createElement('ul');

  for (let prop in obj) {
    // Be aware that template literals do not work in IE
    // Templates allow us to format strings -- much more readable than
    // concatenating strings!
    const text = `${prop}: ${obj[prop]}`;

    ul.appendChild(makeLi(document.createTextNode(text)));
  }

  return ul;
}


/**
 * Remove all the children in a specified node. 
 *
 * @param {Node} node - The node.
 */
function destroyAllChildren(node) {
  // We only want to remove children if any children exist.
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
}


/**
 * The canonical way to send JSON through a POST request when you're using
 * vanilla JavaScript.
 *
 * @param {string} url - Where to send the request.
 * @param {Object} obj - The information to send.
 */
function sendJsonTo(url, obj) {
  // I had really wanted to use fetch() with a Request object, but I had already
  // created this function body off the example on MDN, so in the interest of
  // time, I left it here.
  const xhr = new XMLHttpRequest();
  
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.response);
    }
  };

  xhr.send(JSON.stringify(obj));
};
