

const findVaccineSlots = async () => {
	let response = await fetch('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=294&date=01-05-2021');
	let slots = await response.json(); 
	return slots;
}

const keepAndPrintUnderFortyFiveCenters = (center) => {
	let sessions = center['sessions'];
	for(var session in sessions) {
		let minAgeLimit = sessions[session]['min_age_limit'];
		if (minAgeLimit <= 18) {
			return true;
			}		
		}
		return false;
	}


const keepAvailableSessions = (centers) => {
	let availableSessions = [];

	for (let centerId in centers) {
		let center = centers[centerId];
		let sessions = center['sessions'];
		let availableSessionsCount = 0;
		let availableSession = {};
		availableSession['Center'] = center['name'];
		availableSession['Pincode'] = center['pincode'];
		for(let session in sessions) {
			let availableCapacity = sessions[session]['available_capacity'];
			let minAgeLimit = sessions[session]['min_age_limit'];
			let date = sessions[session]['date']
		    if (availableCapacity >  0 && minAgeLimit <=18) {
		    	availableSession['MinAge'] = minAgeLimit;
			    availableSession['Slots'] = availableCapacity;
			    availableSession['Date'] = date;
		    	availableSessionsCount = availableSessionsCount+1;
		    	continue;
		    }
		}
		if (availableSessionsCount == 0) {
			availableSession['MinAge'] = 18;
			availableSession['Slots'] = 0;
			availableSession['Date'] = 'NA';
		}
		availableSessions.push(availableSession);
	}
	return availableSessions;
}



function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}




findVaccineSlots().then(cowindata => {
	let centers = cowindata['centers'];
	let underFortyFiveCenters = centers.filter(keepAndPrintUnderFortyFiveCenters);
	let availableSessions = keepAvailableSessions(underFortyFiveCenters);
	let table = document.querySelector("table");
	let data = Object.keys(availableSessions[0]);
	generateTableHead(table, data);
	generateTable(table, availableSessions);
});
