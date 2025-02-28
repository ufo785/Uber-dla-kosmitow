const objLog = [];
const objOfert = [];


// Pobieranie użytkowników z serwera
async function fetchUsers() {
  try {
    const response = await fetch('http://localhost:4000/users');
    const data = await response.json();
    objLog.push(...data);
    console.log('Użytkownicy:', objLog);
  } catch (error) {
    console.error('Błąd podczas pobierania użytkowników:', error);
  }
}

// Pobieranie ofert z serwera
async function fetchOffers() {
  try {
    const response = await fetch('http://localhost:4000/offers');
    const data = await response.json();
    objOfert.push(...data);
    console.log('Oferty:', objOfert);
  } catch (error) {
    console.error('Błąd podczas pobierania ofert:', error);
  }
}

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(c => c.startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1] : null;
}

// Logowanie
async function checkLogin() {
  fetchUsers();
  await delay(50);
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
 
  const user = objLog.find(u => u.username === username && u.password === password);
  if (user) {
    console.log('Zalogowano');
        document.cookie = `username=${username}; path=/;`;
    if (user.if_driver) {
      window.location.href = 'admin.html';
      document.cookie = `environment=${user.if_driver}; path=/;`;
    } else {
      window.location.href = 'passenger.html';
    }
  } else {
    alert('Nieprawidłowe dane logowania');
  }
}

// Filtrowanie zamówień
function filterOrders() {
  fetchOffers();
  const filterValue = document.getElementById('filter').value.toLowerCase();
  const filteredData = objOfert.filter(item =>
    item.username.toLowerCase().includes(filterValue) ||
    (item.passenger_loc || '').toLowerCase().includes(filterValue) ||
    (item.target_loc || '').toLowerCase().includes(filterValue)
  );

  const dataContainer = document.getElementById('dataContainer');
  dataContainer.innerHTML = '';

  filteredData.forEach(item => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p>Username: ${item.username}</p>
      <p>Passenger Location: ${item.passenger_loc}</p>
      <p>Target Location: ${item.target_loc}</p>
    `;
    dataContainer.appendChild(div);
  });
}

function saveUser() {
  const username = document.getElementById('potencial_username').value;
  const password = document.getElementById('potencial_password').value;
  const if_river = document.getElementById('if_driver').checked;

  fetch('/register_user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Rejestracja zakończona sukcesem');
    } else {
      alert('Błąd rejestracji: ' + data.error);
      throw new Error("Przerwano działanie funkcji");
    }
  })
  .catch(error => console.error('Błąd:', error));
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function registration() {
  saveUser();
  await delay(50); 
  if (document.getElementById('if_driver').checked) {
    {saveDriver();}}
}
function saveDriver() {
  const username = document.getElementById('potencial_username').value;
  const age = parseInt(document.getElementById('age').value);
  const vehicle_model = document.getElementById('vehicle_model').value;
  const species = document.getElementById('species').value;

  fetch('/register_driver', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, age,vehicle_model,species })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Rejestracja przewoźnika zakończona sukcesem');
    } else {
      alert('Błąd rejestracji przewoźnika: ' + data.error);
    }
  })
  .catch(error => console.error('Błąd:', error));
}
function deleteOrder(orderId) {
  if (confirm('Czy na pewno chcesz usunąć to zamówienie?')) {
    fetch(`/delete_order/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Zamówienie zostało usunięte');

      }
    })
  }
}
function getOrder() {
  // Pobranie danych z formularza
  const passenger_location = document.getElementById('passenger_loc').value;
  const target_location = document.getElementById('target_loc').value;
  const environment = document.getElementById('environment').value;
  const number_of_passenger = parseInt(document.getElementById('number_of_passenger').value);
  const additional_boost = document.getElementById('addtional_boost').checked ? 1 : 0;
  const passenger_username= getCookie('username');

  // Wysyłanie danych do serwera
  fetch('/get_order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({passenger_location,target_location,environment,number_of_passenger,additional_boost,passenger_username})
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Twoje zamówienie zostało przyjęte! Szczegóły: " + JSON.stringify(data.orderDetails));
      } else {
        alert("Błąd tworzenia zamówienia: " + data.error);
      }
    })
    .catch(error => console.error("Błąd:", error));
}

async function updateOffer(price, driver_username, if_accepted, offerId) {
  try {
    const response = await fetch(`http://localhost:4000/offers/${offerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price: price,
        driver_username: driver_username,
        if_accepted: if_accepted,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Błąd podczas aktualizacji oferty');
    }

    const data = await response.json();
    console.log('Sukces:', data.message);
  } catch (error) {
    console.error('Błąd:', error.message);
  }
}

