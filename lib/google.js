import request from 'superagent-bluebird-promise';

export async function geocode(address) {
  const url = `http://maps.googleapis.com/maps/api/geocode/json?address=${address}&sensor=false`;
  const { body } = await request.get(url).promise();
  return body.results[0].geometry.location;
}
