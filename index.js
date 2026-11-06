require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const OBJECT_TYPE = '2-72310222';
const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  'Content-Type': 'application/json'
};

// Homepage: table of all pets
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=name,species,breed`;
  try {
    const resp = await axios.get(url, { headers });
    res.render('homepage', { title: 'Pets | Integrating With HubSpot I Practicum', data: resp.data.results });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Could not load pets');
  }
});

// Form page
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// Create a new pet from the form, then go home
app.post('/update-cobj', async (req, res) => {
  const newPet = {
    properties: {
      name: req.body.name,
      species: req.body.species,
      breed: req.body.breed
    }
  };
  try {
    await axios.post(`https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`, newPet, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Could not create pet');
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
