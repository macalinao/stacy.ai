import request from 'superagent-bluebird-promise';

const API_KEY = 'YliT_3eRG-sh1mttNF97FGbqWnEXu4HuyCIWiQnB'

export async function getUberProductId(latitude, longitude) {
  const url = `https://api.uber.com/v1/products?latitude=${latitude}&longitude=${longitude}&server_token=${API_KEY}`;
  const { body } = await request.get(url).promise();
  return body.products[0].product_id;
}



//now use product id to get request id
//now use request id to request an uber 
