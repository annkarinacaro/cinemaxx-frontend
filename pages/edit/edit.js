export default () => {
    const content = document.querySelector(".content");
    fetch("./pages/edit/edit.html")
        .then((response) => response.text())
        .then((html) => {
        content.innerHTML = html;
        
    });

    const backendURI = "https://cinema-backend1.herokuapp.com";
    const email;
    //DELETE /booking/{id}/?email={email}  
    //PUT/ booking /{id} 


    const findBookings = () =>{
        email = document.querySelector(".email").value;
        fetch(backendURI +"/bookings?email=" + email)
        .then((response) => response.json())
        .then((bookings) =>{

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