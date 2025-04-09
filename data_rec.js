var myAPIKey = "1b95c3f497b54d0f9d3f098eb3636c89";

function encodeAddress(addressObj) {
    return Object.entries(addressObj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
}
  
const address = {
    housenumber: "13/804",
    street: "Regency Anantam",
    city: "Dombivli",
    state: "Maharashtra",
    postcode: "421204",
    country: "India"
};
  
const encodedAddress = encodeAddress(address);
let new_toWaypoint = null;

var requestOptions = {
    method: 'GET',
};

// Use backticks for template literals and myAPIKey variable
fetch(`https://api.geoapify.com/v1/geocode/search?${encodedAddress}&lang=en&limit=5&format=json&apiKey=${myAPIKey}`, requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result);

        if (result != null) {
            const new_toWaypoint = [result.results[0].lat, result.results[0].lon];
            console.log(new_toWaypoint);

            const event = new CustomEvent('testToWaypointReady', { detail: new_toWaypoint });
            window.dispatchEvent(event);
        } else {
            console.log('No results found');
        }
    })
    .catch(error => console.log('error', error));

