// film function to be called when the page loads
function film() {
    displayMovieList()
    // get the first film from the server
    fetch("http://localhost:3000/films")
      .then((result) => result.json())
      .then((movies) => {
        displayMovie(movies[0]);
      });
  }
  
  
  function displayMovie(movie) {
    const movieImage = document.querySelector("#poster");
    movieImage.src = `${movie.poster}`;
  
    const movieTitle = document.querySelector("#title");
    movieTitle.setAttribute("data-id", movie.id);
    movieTitle.innerText = movie.title;
  
    const movieRunTime = document.querySelector("#runtime");
    movieRunTime.innerText = `${movie.runtime} minutes`;
  
    const movieInformation = document.querySelector("#film-info");
    movieInformation.innerText = movie.description;
  
    const movieShowTime = document.querySelector("#showtime");
    movieShowTime.innerText = '';
    movieShowTime.innerText = movie.showtime;
      
    const movieTicketsSold = document.querySelector("#ticket-num");
    const availableTickets = movie.capacity - movie.tickets_sold;
    movieTicketsSold.innerText = `${availableTickets} remaining tickets`

    buyTicket(movie.id);
  }
  
  function displayMovieList() {

    fetch("http://localhost:3000/films")
      .then((result) => result.json())
      .then((movies) => {
        movies.forEach((movie) => {
          const movieList = document.querySelector("#films");
          const movieListLi = document.createElement("li");
          movieListLi.className = "film item";
          movieListLi.id = `${movie.id}`;
          movieListLi.innerHTML = `${movie.title}`;

          movieListLi.appendChild(deleteBtn);
          document.getElementById("films").appendChild(movieListLi);
          displayAnyMovieInMovieList();
          const availableTickets = movie.capacity - movie.tickets_sold;
          const buyTicketButton = document.querySelector("#buy-ticket");
  
          if (availableTickets > 0) {
            buyTicketButton.textContent = "Buy Ticket";
          } else {
            buyTicketButton.textContent = "Sold Out";
            
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
