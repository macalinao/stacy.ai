import request from 'superagent-bluebird-promise';

export async function geocode(address) {
  const url = `http://maps.googleapis.com/maps/api/geocode/json?address=${address}&sensor=false`;
  const res = await request.get(url).promise();
  return res.body.results[0].geometry.location;
}
