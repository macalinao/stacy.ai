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

export async function hotelNameAndPrice(checkin, checkout, latitude, longtitude) {
  console.log('test1');
  console.log(checkin+":"+checkout+":"+latitude+":" + longtitude);
  const url = `http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?`
    + `latitude=${latitude}&longitude=${longtitude}&radius=50`
    + `&check_in=${checkin}&check_out=${checkout}&chain=RT&cy=EUR`
    + `&number_of_results=50&apikey=${API_KEY}`;
    console.log('test2');
  const { body } = await request.get(url).promise();
    console.log('test3');
  const main = body.results[0];
    console.log(main.location);
  return {
    name: main.property_name,
    lat: main.location.latitude,
    lng: main.location.longitude,
    price: main.total_price.amount
  };
}

export async function airport(lat, lon) {
  const url = `http://api.sandbox.amadeus.com/v1.2/airports/nearest-relevant?apikey=${API_KEY}&latitude=${lat}&longitude=${lon}`;
  const res = await request.get(url);
  console.log(res.body[0]);
  return {
    city: res.body[0].city_name,
    airport: res.body[0].airport
  };
}
