import * as amadeus from './amadeus';
import * as google from './google';
import * as uber from './uber';
import moment from 'moment';

const handlers = [
  {
    expr: /Plan my trip to/g,
    handler: async(session, msg) => {
      let city = msg.replace("Plan my trip to", "");
      city = city.substring(0, city.length - 1);
      session.city = city;
      session.geocode = await google.geocode(city);
      session.destairport = await amadeus.airport(session.geocode.lat,session.geocode.lng);
      return {
        msg: `Cool, let's plan your trip to ${city}!`,
        session
      };
    }
  },
  {
    expr: /uber/gi,
    handler: async(session, msg) => {
      var airportgeocode = await google.geocode(session.destairport);
      console.log(airportgeocode);
      var hotel = session.hotel;
      console.log(hotel);
      var priceEstimate = await uber.getPriceEstimate(airportgeocode.lat,airportgeocode.lng,hotel.lat,hotel.lng);
      console.log(priceEstimate);
      return {
        msg: `It'll be about ${priceEstimate}`,
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
      console.log(session)
      const hotel = await amadeus.hotelNameAndPrice(
        session.startdate.format("YYYY-MM-DD"),
        session.enddate.format("YYYY-MM-DD"),
        session.geocode.lat, session.geocode.lng);
      console.log(hotel);
      session.hotel = hotel;
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
      console.log(session.destairport + ":" + session.startdate.format("YYYY-MM-DD") + ":" + session.enddate.format("YYYY-MM-DD") );
      const fare = await amadeus.findFare({
        origin: 'BOS',
        dest: session.destairport,
        depart: session.startdate.format("YYYY-MM-DD"),
        ret: session.enddate.format("YYYY-MM-DD")
      });
      console.log(fare);
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
  },
  {
    expr: /.+?(?=from)from \d+\d+\-\d+\d+ to \d+\d+\-\d+\d+/gi,
    handler: async(sesion, msg) => {
      console.log(msg)
      var parts1 = msg.split(" from ");
      var parts = parts1[1].split(" to ");
      var startPart = parts[0];
      var endPart = parts[1];
      console.log(startPart+":"+endPart)
      session.startdate = moment("2015-" + startPart);
      console.log("eoauo")
      session.enddate = moment("2015-" + endPart);
      console.log("eoueoau2")
      console.log(session.enddate)
      session.city = parts1[0];
      console.log(session.city)
      return {
        msg: `Alright, let's plan your trip to ` + session.city,
        session
      };
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
