const objVehicles = [];
const objLocation = [];

document.addEventListener("DOMContentLoaded", async () => {
    try { 
        const response = await fetch('http://localhost:4000/vehicles');
        const data = await response.json();
        objVehicles.push(...data);
        console.log('Pojazdy:', objVehicles);
    } catch (error) {
        console.error('Błąd podczas pobierania pojazdów:', error);
    }

    const vehicleSelect = document.getElementById('vehicle_model');
    const environmentSelect = document.getElementById('environment');

    // Wyczyść istniejące opcje
    vehicleSelect.innerHTML = '';
    environmentSelect.innerHTML = '';

    // Wypełnij opcje pojazdów i środowisk
    const uniqueEnvironments = new Set();

    objVehicles.forEach(vehicle_model => {
        const option = document.createElement('option');
        option.value = vehicle_model.vehicle_model;
        option.textContent = `${vehicle_model.vehicle_model} ${vehicle_model.cost}$/rok świetlny`;
        vehicleSelect.appendChild(option);

        // Dodaj środowisko do zbioru unikalnych środowisk
        uniqueEnvironments.add(vehicle_model.environment);
    });

    // Wypełnij unikalne opcje środowiska
    uniqueEnvironments.forEach(environment => {
        const environmentOption = document.createElement('option');
        environmentOption.value = environment;
        environmentOption.textContent = environment;
        environmentSelect.appendChild(environmentOption);
    });
});

document.addEventListener("DOMContentLoaded", async () => { // location options
try {
    const response = await fetch('http://localhost:4000/location');
    const data = await response.json();
    objLocation.push(...data);
    console.log('Lokacje:', objLocation);
} catch (error) {
    console.error('Błąd podczas pobierania lokalizacji:', error);
}
const passengerLcationSelect = document.getElementById('passenger_loc');
const targetLocationSelect = document.getElementById('target_loc');
objLocation.forEach(location => {
    const passenger_option = document.createElement('option');
    const target_option = document.createElement('option');
    passenger_option.value = location.location_id;
    passenger_option.textContent = location.address;
    target_option.value = location.location_id;
    target_option.textContent = location.address;
    passengerLcationSelect.appendChild(passenger_option);
    targetLocationSelect.appendChild(target_option);});
});