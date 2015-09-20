import request from 'superagent-bluebird-promise';

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
    + `&number_of_results=3&apikey=5O8rga7DF6pJAnARH4b18YfJvF8nieSO`;
}


//hotel code//
function hotelNameAndPrice(checkin, checkout, langtitude, longtitude){//date must be in form yyyy-mm-dd
    var url = "http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?latitude="+langtitude+"&longitude="+longtitude+"&radius=50&check_in="+checkin+"&check_out="+checkout+"&chain=RT¤cy=EUR&number_of_results=50&apikey=5O8rga7DF6pJAnARH4b18YfJvF8nieSO";
    request(url, function(error,response,body){
            if(!error && response.statusCode == 200) {
                    var results = JSON>parse(body).results[0];
                    var property_name = results.property_name; //name of hotel;
                    var lat = results.location.latitude; //lat
                    var lng = results.location.longitude; //lng
                    var price = results.total_price.amount;
                    return {name: property_name, lat: lat, lng: lng, price: price};
             }
    });
}

