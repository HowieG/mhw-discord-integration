require('dotenv').config()
const express = require("express");
const path = require('path');
const cors = require("cors");
const bp = require("body-parser");
const app = express();
const port = '53134';
app.use(cors())
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
app.use('', express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
	return response.sendFile('index.html', { root: '.' });
});

app.get('/auth/discord', (request, response) => {
	return response.sendFile('dashboard.html', { root: '.' });
});

// Adds hacker's Discord User ID  to Airtable, creating a new record if they don't exist
app.post('/addHacker', (request, response) => {
	const Airtable = require('airtable');

	var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appMXYpSUyxWmFVrG');

	/*
		TODO: Norus will have to identify which user record they want to update.
		Existing users must've logged in so they know who it is and their associated record
	*/
	//var hackerRecordID = null; // Uncomment to test create() flow
	var hackerRecordID = "recJ7Usv7dJVsiZYF";

	if (hackerRecordID) {
		base('Hackers').update([
			{
				"id": hackerRecordID,
				"fields": request.body
			}
		], function (err, records) {
			if (err) {
				console.error(err);
				return;
			}

			response.json(records);
		});
	}
	else {
		base('Hackers').create([
			{
				"fields": request.body

				/*

					TODO: Norus will have to fill the missing fields e.g. Name, Chosen Hacker House, etc.
					fields just expects a JSON containing the data. Sample:

					"fields": {
						"Name": "Howard Gil",
						"Discord Username": "hgil",
						"Discord User ID": "395685127897743361",
						"Chosen Hacker House": [
						"recFO342a3nd7Mwp2"
						]
					}

				*/
			}
		], function (err, records) {
			if (err) {
				console.error(err);
				return;
			}

			response.json(records);
		});
	}
});