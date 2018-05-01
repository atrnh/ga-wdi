// An IIFE (Immediately Invoked Function Expression). This makes it clear to
// others that the code in the IIFE is our 'main' code, and that the variables
// inside aren't going to be used globally, anywhere else. 
(function () {
  const form = document.getElementById('searchForm');
  const resultsList = document.getElementById('results');
  const detailsDiv = document.getElementById('details-container');

  form.onsubmit = e => {
    e.preventDefault();

    const formData = new FormData(form);

    // You must pass formData.get a string that matches the value of the name
    // property of your form input
    //
    // In this case, we only have one -- the movie title to search for
    searchOMDb(formData.get('title'))
      .then(r => renderMovies(r.Search, resultsList, detailsDiv))

      // Later, we'll want to make more robust error handling, but this is fine
      // for now
      .catch(err => console.log(err));
  };
})();
