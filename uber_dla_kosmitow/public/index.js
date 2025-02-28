const objSpiecies = [];
const objVehicles = [];


document.addEventListener("DOMContentLoaded", async () => { // species options
    try {
      const response = await fetch('http://localhost:4000/species');
      const data = await response.json();
      objSpiecies.push(...data);
      console.log('Gatunki:', objSpiecies);
    } catch (error) {console.error('Błąd podczas pobierania gatunków:', error);}
    // Wypełnij <select> dla gatunków
    const speciesSelect = document.getElementById('species');
    objSpiecies.forEach(species => {
      const option = document.createElement('option');
      option.value = species.species;
      option.textContent = species.species;
      speciesSelect.appendChild(option);});
  });
document.addEventListener("DOMContentLoaded", async () => { // vehicles options
try { 
    const response = await fetch('http://localhost:4000/vehicles');
    const data = await response.json();
    objVehicles.push(...data);
    console.log('Pojazdy:', objVehicles);
} catch (error) {
    console.error('Błąd podczas pobierania pojazdów:', error);
}
const vehicleSelect = document.getElementById('vehicle_model');
objVehicles.forEach(vehicle_model => {
    const option = document.createElement('option');
    option.value = vehicle_model.vehicle_model;
    option.textContent = `${vehicle_model.vehicle_model} ${vehicle_model.cost}$/rok świetlny`;
    vehicleSelect.appendChild(option);
});
});
function Show() {
  const extraFields = document.getElementById("Exstra");
   const checkbox = document.getElementById("if_driver");

    // Pokazuje/ ukrywa pola
    if (checkbox.checked) {
        extraFields.style.display = "block";
    } else {
        extraFields.style.display = "none";
    }
}
Show();