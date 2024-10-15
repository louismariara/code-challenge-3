function film() {
    displayMovieList()
    // get the first film from the server
    fetch("http://localhost:3000/films")
   // Fetch movie data from API
fetch("http://localhost:3000/films")
.then((result) => result.json()) // Parse JSON response
.then((movies) => {
  // Display the first movie in the list
  displayMovie(movies[0]);
});

// Function to display a single movie
function displayMovie(movie) {
// Update movie poster image
const movieImage = document.querySelector("#poster");
movieImage.src = `${movie.poster}`;

// Update movie title and set data-id attribute
const movieTitle = document.querySelector("#title");
movieTitle.setAttribute("data-id", movie.id);
movieTitle.innerText = movie.title;

// Update movie runtime
const movieRunTime = document.querySelector("#runtime");
movieRunTime.innerText = `${movie.runtime} minutes`;

// Update movie information
const movieInformation = document.querySelector("#film-info");
movieInformation.innerText = movie.description;

// Update movie showtime
const movieShowTime = document.querySelector("#showtime");
movieShowTime.innerText = ''; // Clear existing text
movieShowTime.innerText = movie.showtime;

// Update available tickets
const movieTicketsSold = document.querySelector("#ticket-num");
const availableTickets = movie.capacity - movie.tickets_sold;
movieTicketsSold.innerText = `${availableTickets} remaining tickets`

// Call function to handle buying a ticket
buyTicket(movie.id);
}

// Function to display the movie list
function displayMovieList() {
// Fetch movie list from API
fetch("http://localhost:3000/films")
  .then((result) => result.json()) // Parse JSON response
  .then((movies) => {
    // Loop through each movie in the list
    movies.forEach((movie) => {
      // Create a new list item for the movie
      const movieList = document.querySelector("#films");
      const movieListLi = document.createElement("li");
      movieListLi.className = "film item";
      movieListLi.id = `${movie.id}`;
      movieListLi.innerHTML = `${movie.title}`;

      // Add delete button to the list item
      movieListLi.appendChild(deleteBtn);
      document.getElementById("films").appendChild(movieListLi);

      // Call function to display any movie in the list
      displayAnyMovieInMovieList();

      // Check if tickets are available
      const availableTickets = movie.capacity - movie.tickets_sold;
      const buyTicketButton = document.querySelector("#buy-ticket");

      if (availableTickets > 0) {
        buyTicketButton.textContent = "Buy Ticket";
      } else {
        buyTicketButton.textContent = "Sold Out";

        // Mark sold-out movies in the list
        const movieTitles = document.querySelectorAll(".film.item");
        movieTitles.forEach((movieTitle) => {
          if (movieTitle.id === movie.id) {
            movieTitle.className = "sold-out";
          }
        });
      }
    });
  });
}
  
  function buyTicket(movieId) {
    const buyTicketButton = document.querySelector("#buy-ticket");
   
    buyTicketButton.removeEventListener("click", handleBuyTicket);

    buyTicketButton.addEventListener("click", handleBuyTicket);
  }
   
    function handleBuyTicket() {
     
      const tickets = document.querySelector("#ticket-num").innerText.split(" ")[0];
      if (parseInt(tickets) === 1) {
        const buyTicketButton = document.querySelector("#buy-ticket");
    buyTicketButton.textContent = "Buy Ticket";
    const movieId = document.querySelector("#title").getAttribute("data-id");
        fetch(`http://localhost:3000/films/${movieId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((result) => result.json())
          .then((movie) => {
            const updatedTicketsSold = movie.tickets_sold + 1;
  
            return fetch(`http://localhost:3000/films/${movieId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
            
              body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
            });
          })
          .then((result) => result.json())
          .then((updatedMovie) => {
            const remainingTickets = updatedMovie.capacity - updatedMovie.tickets_sold;
            document.querySelector("#ticket-num").innerText = `${remainingTickets} remaining tickets`;
            const buyTicketButton = document.querySelector("#buy-ticket");
            buyTicketButton.textContent = "Sold Out";
            const movieTitles = document.querySelectorAll(".film.item");
            movieTitles.forEach(function (movieTitle) {
              if (movieTitle.id === updatedMovie.id) {
                movieTitle.className = "sold-out";
              }
            });
          });
      }
      else if (tickets > 0) {
        const buyTicketButton = document.querySelector("#buy-ticket");
        buyTicketButton.textContent = "Buy Ticket";
        const movieId = document.querySelector("#title").getAttribute("data-id");
        fetch(`http://localhost:3000/films/${movieId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((result) => result.json())
          .then((movie) => {
            const updatedTicketsSold = movie.tickets_sold + 1;
            return fetch(`http://localhost:3000/films/${movieId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
            });
          })
          .then((result) => result.json())
          .then((updatedMovie) => {
            const remainingTickets =
              updatedMovie.capacity - updatedMovie.tickets_sold;
            document.querySelector(
              "#ticket-num"
            ).innerText = `${remainingTickets} remaining tickets`;
    
            fetch("http://localhost:3000/tickets", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                film_id: updatedMovie.id,
                number_of_tickets: 1,
              }),
            });
          });
      }
      else {
        const movieId = document.querySelector("#title").getAttribute("data-id");
        fetch(`http://localhost:3000/films/${movieId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((result) => result.json())
          .then((movie) => {
            const buyTicketButton = document.querySelector("#buy-ticket");
            buyTicketButton.textContent = "Sold Out";
          });
      }
    }
    
    function displayAnyMovieInMovieList() {
      const movieList = document.querySelectorAll(".film.item");
    
      movieList.forEach(function (film) {
        film.addEventListener("click", selectMovieFromList);
      });
    }
    
    function selectMovieFromList(event) {
      const movieId = event.target.id;
      fetch(`http://localhost:3000/films/${event.target.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((result) => result.json())
        .then((movie) => {
          displayMovie(movie);
        });
    }
    
    function deleteMovie(movieId) {
      fetch(`http://localhost:3000/films/${movieId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((result) => {
        const movieItem = document.getElementById(movieId);
        movieItem.remove();
      });
    }
  }