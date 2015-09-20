import request from 'superagent-bluebird-promise';

const API_KEY = '5O8rga7DF6pJAnARH4b18YfJvF8nieSO';

export async function findFare({ origin, dest, depart, ret }) {
  const url = buildUrl({ origin, dest, depart, ret });
  const { body } = await request.get(url).promise();
  const { results } = body;
  try {
    const itin = results[0].itineraries[0];
    return {
      in: itin.inbound.flights[0],
      out: itin.outbound.flights[0]
    };
  } catch (e) {
    return null;
  }
}

function buildUrl({ origin, dest, depart, ret }) {
  return `http://api.sandbox.amadeus.com/v1.2/`
    + `flights/low-fare-search?origin=${origin}&destination=${dest}`
    + `&departure_date=${depart}&return_date=${ret}`
    + `&number_of_results=3&apikey=${API_KEY}`;
}

<<<<<<< HEAD

//hotel code//
function hotelNameAndPrice(checkin, checkout, langtitude, longtitude){//date must be in form yyyy-mm-dd
    var url = "http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?latitude="+langtitude+"&longitude="+longtitude+"&radius=50&check_in="+checkin+"&check_out="+checkout+"&chain=RT&cy=EUR&number_of_results=50&apikey=5O8rga7DF6pJAnARH4b18YfJvF8nieSO";
    request(url, function(error,response,body){
            if(!error && response.statusCode == 200) {
                    var results = JSON.parse(body).results[0];
                    var property_name = results.property_name; //name of hotel;
                    var lat = results.location.latitude; //lat
                    var lng = results.location.longitude; //lng
                    var price = results.total_price.amount;
                    return {name: property_name, lat: lat, lng: lng, price: price};
             }
    }
=======
export async function hotelNameAndPrice(checkin, checkout, latitude, longtitude) {
    const url = `http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?`
      + `latitude=${latitude}&longitude=${longitude}&radius=50`
      + `&check_in=${checkin}&check_out=${checkout}&chain=RT¤cy=EUR`
      + `&number_of_results=50&apikey=${API_KEY}`;
    const { body } = await request.get(url).promise();
    const main = body.results[0];
    return {
      name: main.property_name,
      lat: main.location.latitude,
      lng: main.location.longitude,
      price: main.total_price.amount
    };
>>>>>>> a65ef74b11a6ea8cdad92682744a229254f877b6
}

export async function airport(lat, lon) {
  const url = `http://api.sandbox.amadeus.com/v1.2/airports/nearest-relevant?apikey=${API_KEY}&latitude=${lat}&longitude=${lon}`;
  const res = await request.get(url);
  return res.body[0].airport;
}
