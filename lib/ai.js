import * as amadeus from './amadeus';

const handlers = [
  {
    expr: /flight/g,
    handler: async(session, msg) => {
      const fare = await amadeus.findFare({
        origin: 'BOS',
        dest: 'DFW',
        depart: '2015-10-01',
        ret: '2015-10-03'
      });
      if (fare) {
        return {
          msg: `Found a flight.`,
          fare
        };
      } else {
        return {
          msg: `Couldn't find a flight. Ask for a different location.`,
          fare
        };
      }
    }
  }
];

export default async function(session, msg) {
  for (let i = 0; i < handlers.length; i++) {
    if (handlers[i].expr.test(msg)) {
      handlers[i].expr = new RegExp(handlers[i].expr);
      return handlers[i].handler(session, msg);
    }
  }
  return {
    msg: `Cool! You said ${msg}`
  };
}
