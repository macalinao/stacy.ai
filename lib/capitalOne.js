import request from 'superagent-bluebird-promise';

const API_KEY = 'b59522ad17e95f44a3c01c23112951b3'

export async function getRewards() {
  const url = `http://api.reimaginebanking.com/customers/55e94a6af8d8770528e60dcb/accounts?key=${API_KEY}`;
  const { body } = await request.get(url).promise();
  return body[0].rewards.toString();
}


