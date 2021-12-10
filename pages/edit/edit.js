export default () => {
    const content = document.querySelector(".content");
    fetch("./pages/edit/edit.html")
        .then((response) => response.text())
        .then((html) => {
        content.innerHTML = html;
        initBookingButton();
        
    });

    const backendURI = "https://cinema-backend1.herokuapp.com";
    let email;
    //DELETE /booking/{id}/?email={email}  
    //PUT/ booking /{id} 

    const initBookingButton = () =>{
        const bookingButton = document.querySelector(".find-booking-button");
        bookingButton.addEventListener("click", findBookings);    
    }



    const findBookings = () =>{
        email = document.querySelector(".email").value;
        fetch(backendURI +"/bookings?email=" + email)
        .then((response) => response.json())
        .then((bookings) =>{
            const tableElement = document.querySelector("table.bookings-table");
            bookings.forEach(booking => {
                const trElement = document.createElement("tr");
                tableElement.appendChild(trElement);
                const movieTdElement = document.createElement("td");
                movieTdElement.innerHTML = booking.viewing.movie.title;
                
                
                

            });
           


        });

    };

   

    const deleteAbooking = () => {
        const email = document.querySelector(".email").value;
        fetch(backendURI + "/booking/" + id, {
            method: 'DELETE'})
        .then((response) => response.json())
        .then((deleteBooking) => {

        });
    };

  

}