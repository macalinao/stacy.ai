import * as amadeus from './amadeus';
import * as google from './google';
import moment from 'moment';
const handlers = [
  {
    expr: /Plan my trip to/g,
    handler: async(session, msg) => {
      let city = msg.replace("Plan my trip to", "");
      city = city.substring(0, city.length - 1);
      session.city = city;
      session.geocode = await google.geocode(city);
      return {
        msg: `Cool, let's plan your trip to ${city}!`,
        session
      };
    }
  },
   {
    expr: /\d+\d+\-\d+\d+ to \d+\d+\-\d+\d+/g,
    handler: async(session, msg) => {
      var parts = msg.split(" to ");
      var startPart = parts[0];
      var endPart = parts[1];
      session.startdate = moment("2015-" + startPart);
      session.enddate = moment("2015-" + endPart);
      return {
        msg: `Alright, type flight to find a flight` 
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
           msg: `Could'nt find a hotel, ask for something else`,
           hotel
        };
      }
    }
  },
  {
    expr: /flight/g,
    handler: async(session, msg) => {
      session.city = "Dallas";
      const fare = await amadeus.findFare({
        origin: 'BOS',
        dest: 'DFW',
        depart: session.startdate.format("YYYY-MM-DD"),
        ret: session.enddate.format("YYYY-MM-DD")
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
