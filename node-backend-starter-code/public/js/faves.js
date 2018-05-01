// An IIFE (Immediately Invoked Function Expression). This makes it clear to
// others that the code in the IIFE is our 'main' code, and that the variables
// inside aren't going to be used globally, anywhere else. 
(function () {
  const favesList = document.getElementById('favorites');
  const detailsDiv = document.getElementById('details');


  window.onload = () => {
    fetch('favorites.json')
      .then(res => res.json())
      .then(movies => renderMovies(movies, favesList, detailsDiv, true))
      .catch(e => console.log(e));
  };
})();
