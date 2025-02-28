const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 4000;
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ufo'
});

app.use(express.json());

// Endpoint do pobierania użytkowników
app.get('/users', (req, res) => {
  const query = `
SELECT 
    users.username, 
    users.password, 
    drivers.vehicle_model,
    vehicle.environment
FROM 
    users
LEFT JOIN 
    drivers ON users.username = drivers.username
LEFT JOIN 
    vehicle ON drivers.vehicle_model = vehicle.vehicle_model

  `;
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Błąd zapytania do bazy danych' });
    } else {
      const users = results.map(row => ({
        username: row.username,
        password: row.password,
        if_driver: row.environment ? row.environment : null
      }));
      res.json(users); 
    }
  });
});

// Endpoint do pobierania ofert
app.get('/offers', (req, res) => {
  const mainQuery = `SELECT * FROM transportation`; 
  const locationQuery = 'SELECT * FROM location';

  connection.query(mainQuery, (error, transportResults) => {
    if (error) {
      res.status(500).json({ error: 'Błąd podczas pobierania ofert' });
      return;
    }

    connection.query(locationQuery, (locError, locationResults) => {
      if (locError) {
        res.status(500).json({ error: 'Błąd podczas pobierania lokalizacji' });
        return;
      }

      const offers = transportResults.map(row => {
        let target_location = null;
        let passenger_location = null;

        locationResults.forEach(loc => {
          if (loc.location_id === row.target_location) {
            target_location = `${loc.planetary_system}, ${loc.galaxy}, ${loc.planet}`;
          }
          if (loc.location_id === row.passenger_location) {
            passenger_location = `${loc.planetary_system}, ${loc.galaxy}, ${loc.planet}`;
          }
        });
        return {
          ifAccepted: row.if_accepted,
          passenger_username: row.passenger_username,
          driver_username: row.driver_username,
          environment: row.environment,
          number_of_passengers: row.number_of_passenger,
          price: row.price,
          target_loc: target_location,
          passenger_loc: passenger_location,
          id:row.id,
          additional_boost: row.additional_boost ? "tak" : "nie"
        };
      }); 
      res.status(200).send(offers);
    });
  });
});
app.post('/register_user', (req, res) => {
  const { username, password } = req.body;

  // Sprawdzamy, czy użytkownik już istnieje
  const checkQuery = 'SELECT * FROM users WHERE username = ?';
  connection.query(checkQuery, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Błąd bazy danych' });
    }

    if (results.length > 0) {
      return res.status(400).json({ success: false, error: 'Taki login już istnieje' });
    }

    const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
    connection.query(insertQuery, [username, password], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Błąd zapisu do bazy' });
      }
      res.status(200).json({ success: true });
    });
  });
});

app.post('/register_driver', (req, res) => {
  const { username, age, vehicle_model, species } = req.body;

  // Walidacja danych wejściowych
  if (!username || !age || !vehicle_model || !species) {
    return res.status(400).json({ success: false, error: 'Wszystkie pola są wymagane' });
  }

  // Wstawienie przewoźnika do tabeli `drivers`
  const insertDriverQuery = `
    INSERT INTO drivers (username, age, vehicle_model, species)
    VALUES (?, ?, ?, ?)
  `;
  connection.query(insertDriverQuery, [username, age, vehicle_model, species], (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Błąd zapisu przewoźnika do bazy' });
    }

    res.status(200).json({ success: true, message: 'Przewoźnik został zarejestrowany' });
  });
});
app.post('/get_order', (req, res) => {
  const { passenger_location, target_location, environment, number_of_passenger, additional_boost ,passenger_username} = req.body;

  // Zapytanie SQL do zapisania danych w tabeli
  const query = `
    INSERT INTO transportation (passenger_location, target_location, environment, number_of_passenger, additional_boost, passenger_username)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [passenger_location, target_location, environment, number_of_passenger, additional_boost, passenger_username];

  // Wykonanie zapytania SQL
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Błąd przy zapisie do bazy:', err);
      return res.status(500).json({ success: false, error: "Błąd serwera." });
    }

    res.status(200).json({
      success: true,
      message: "Zamówienie zostało utworzone.",
      orderId: results.insertId // ID wstawionego rekordu
    });
  });
});

// Endpoint do pobrania pojazdów
app.get('/vehicles', async (req, res) => {
  const query='SELECT * FROM vehicle';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Błąd zapytania do bazy danych' });
    } else {
      const vehicle_model = results.map(row => ({
        vehicle_model: row.vehicle_model,
        environment: row.environment,
        cost: row.cost
      }));
      res.json(vehicle_model);
      
    }
  });
});

// Endpoint do pobrania gatunków
app.get('/species', async (req, res) => {
  const query = 'SELECT DISTINCT species FROM drivers';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Błąd zapytania do bazy danych' });
    } else {
      const species = results.map(row => ({
        species: row.species
      }));
      res.json(species);
      
    }
  });
});

// Endpoint do pobrania lokalizacji
app.get('/location', async (req, res) => {
  const query='SELECT * FROM location';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Błąd zapytania do bazy danych' });
    } else {
      const location = results.map(row => ({
        address:row.galaxy+", "+row.planetary_system+", "+row.planet,
        location_id: row.location_id
      }));
      res.json(location);
      
    }
  });
});
// Endpoint do tworzenia oferty
app.put('/offers/:id', (req, res) => {
  const offerId = req.params.id; // Pobranie ID oferty z URL
  const { price, driver_username, if_accepted } = req.body; // Pobranie danych z ciała żądania
  
  if (if_accepted===2){
    const query = `
    UPDATE transportation
    SET if_accepted = ?
    WHERE id = ?
  `;
  // Wykonanie zapytania
  connection.query(query, [if_accepted, offerId], (error, results) => {
    if (error) {
      console.error('Błąd podczas aktualizacji oferty:', error);
      return res.status(500).json({ error: 'Błąd podczas aktualizacji oferty w bazie danych' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Nie znaleziono oferty o podanym ID' });
    }

    res.status(200).json({ message: 'Oferta została pomyślnie zaktualizowana' });
  });
  }else{
    const query = `
    UPDATE transportation
    SET price = ?, driver_username = ?, if_accepted = ?
    WHERE id = ?
  `;
  // Wykonanie zapytania
  connection.query(query, [price, driver_username, if_accepted, offerId], (error, results) => {
    if (error) {
      console.error('Błąd podczas aktualizacji oferty:', error);
      return res.status(500).json({ error: 'Błąd podczas aktualizacji oferty w bazie danych' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Nie znaleziono oferty o podanym ID' });
    }

    res.status(200).json({ message: 'Oferta została pomyślnie zaktualizowana' });
  });};
});
// Endpoint do usuwania oferty
app.delete('/delete_order/:orderId', (req, res) => {
  const { orderId } = req.params;

  // Walidacja wejścia
  if (!orderId) {
    return res.status(400).json({ success: false, error: "Brak ID zamówienia." });
  }

  // Zapytanie SQL do usunięcia zamówienia
  const query = `DELETE FROM transportation WHERE id = ?`;

  // Wykonanie zapytania SQL
  connection.query(query, [orderId], (err, results) => {
    if (err) {
      console.error('Błąd przy usuwaniu zamówienia:', err.message);
      return res.status(500).json({ success: false, error: "Błąd serwera. Spróbuj ponownie później." });
    }

    if (results.affectedRows === 0) {
      // Jeśli nie znaleziono zamówienia o podanym ID
      return res.status(404).json({ success: false, error: "Zamówienie nie zostało znalezione." });
    }

    // Sukces
    res.status(200).json({ success: true, message: "Zamówienie zostało usunięte." });
  });
});


// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Serwer działa na porcie http://localhost:${port}`);
});
