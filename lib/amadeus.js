import request from 'superagent-bluebird-promise';

export async function findFare({ origin, dest, depart, ret }) {
  const url = buildUrl({ origin, dest, depart, ret });
  const { body } = await request.get(url).promise();
  const { results } = body;
  try {
    return results[0].itineraries[0].outbound.flights[0];
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
