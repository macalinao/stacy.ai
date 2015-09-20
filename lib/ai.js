import * as amadeus from './amadeus';

const handlers = [
  {
    expr: /cancel/g,
    handler: async(session, msg) => {
      session.city = ""
      return {
        msg: `Cancelled your trip!`
      };
    }
  },
  {
    expr: /\d+\d+\-\d+\d+/g,
    handler: async(session, msg) => {
      var parts = msg.split("-");
      var d = new Date(2015,parts[0]-1,parts[1]);
      session.startdate = d;
      return {
        msg: `Alright, type flight to find a flight`
      };
    }
  },
  {
    expr: /trip/g,
    handler: async(session, msg) => {
      const city = msg.replace("Plan my trip to","");
      session.city = city
      return {
        msg: `Cool, let's plan your trip to ` + city + `\n When do you want to travel?`
      };
    }
  },
  {
    expr: /hotel/g,
    handler: async(session, msg) => {
      const city = session.city
      const hotel = "El Cheapo hotel"
      if (hotel) {
        return {
          msg: `Found a hotel in` + city,
          hotel
        };
      }else {
        return {
           msg: `Could'nt find a hotl, ask for something else`,
           hotel
        };
      }
    }
  },
  {
    expr: /flight/g,
    handler: async(session, msg) => {
      session.city = "Dallas"
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
