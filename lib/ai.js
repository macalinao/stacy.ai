import * as amadeus from './amadeus';
import * as google from './google';
import * as uber from './uber';
import moment from 'moment';
import P from 'bluebird';

const handlers = [

  {
    expr: /I want to eat /g,
    prefix: `Searching for food...`,
    handler: async(session, msg) => {
      let food = msg.replace("I want to eat", "");
      return {
        msg: `I found ${food} for $43.68 from Fuzzy's Taco Shop.`
      };
    }
  },

  {
    expr: /Plan my trip to/g,
    handler: async(session, msg) => {
      let city = msg.replace("Plan my trip to", "");
      city = city.substring(0, city.length - 1);
      session.geocode = await google.geocode(city);
      const air = await amadeus.airport(session.geocode.lat, session.geocode.lng);
      city = session.city = air.city;
      session.destairport = air.airport;
      return {
        msg: `Cool, let's plan your trip to ${city}! We've found your local airport at BOS and the airport you're traveling to at ${session.destairport}. When do you want to travel? (mm-dd to mm-dd)`,
        session
      };
    }
  },

  {
    expr: /to hotel/gi,
    prefix: `Getting an Uber estimate...`,
    handler: async(session, msg) => {
      var airportgeocode = await google.geocode(session.destairport);
      var hotel = session.hotel;
      if (!hotel) {
        return {
          msg: `You don't have a hotel.`,
        };
      }
      if (msg.match(/no/i)) {
        return {
          msg: `Do you need a hotel?`
        };
      }
      console.log(airportgeocode.lat +":" + airportgeocode.lng +":" + hotel.lat + ":" + hotel.lng);
      var priceEstimate = await uber.getPriceEstimate(airportgeocode.lat,airportgeocode.lng,hotel.lat,hotel.lng);
      console.log(priceEstimate);
      return {
        price: priceEstimate,
        msg: `It'll be about ${priceEstimate}`
      };
    }
  },
  {
    expr: /food/gi,
    handler: async(session, msg) => {
      var airportgeocode = await google.geocode(session.destairport);
      var hotel = session.hotel;
      if (!hotel) {
        return {
          msg: `You don't have a hotel.`,
        };
      }
      if (!msg.match(/no/i)) {
        return {
          msg: [`Setting up a postmates delivery.`,`Do you need an uber to the hotel?`]
        };
      }else {
        return {
          msg: [`Alright, no food.`, `Do you need an uber to the hotel?`]
        }
      }
      
    }
  },

  {
    expr: /hotel/g,
    prefix: `Searching for a hotel...`,
    handler: async(session, msg) => {
      if (!session.city || !session.geocode) {
        return {
          msg: `You haven't chosen a city.`
        };
      }
      const city = session.city
      if (!session.startdate) {
        return {
          msg: `When do you want to stay? E.g. 10-10 to 10-15`
        };
      }
      const hotel = await amadeus.hotelNameAndPrice(
        session.startdate.format("YYYY-MM-DD"),
        session.enddate.format("YYYY-MM-DD"),
        session.geocode.lat, session.geocode.lng);
      session.hotel = hotel;
      console.log(hotel);
      if (hotel) {
        return {
          msg: `You can stay at ` + hotel.name + ` in ` + city + ". Do you need food?" ,
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
    expr: /to airport/gi,
    prefix: `Getting an Uber estimate...`,
    handler: async(session, msg) => {
      if (msg.match())
      console.log("ee");
      var airportgeocode = await google.geocode("1 Harborside Dr, Boston, MA 02128");
      var originGeocode = await google.geocode("77 Massachusetts Ave, Cambridge, MA 02139");
      console.log(airportgeocode.lat +":"+ airportgeocode.lng +":"+session.geocode.lat + ":" + session.geocode.lng);
      var priceEstimate = await uber.getPriceEstimate(originGeocode.lat,originGeocode.lng,airportgeocode.lat,airportgeocode.lng);
      console.log(priceEstimate);
      return {
        msg: [`It'll be about ${priceEstimate}`,`Do you need a hotel?`],
        price: priceEstimate
      };
    }
  },

  {
    expr: /.+?(?=from)from \d+\d+\-\d+\d+ to \d+\d+\-\d+\d+/gi,
    handler: async(session, msg) => {
      var fromParts = msg.split("from");
      var parts = fromParts[1].split(" to ");
      var startPart = parts[0];
      var endPart = parts[1];
      var startString = "2015-" + startPart;
      var endString = "2015-" + endPart;
      session.city = fromParts[0];
      session.startdate = moment(startString);
      session.enddate = moment(endString);
      session.geocode = await google.geocode(session.city);
      session.destairport = await amadeus.airport(session.geocode.lat,session.geocode.lng);
      return {
        msg: `Alright, let's plan your trip to ` + session.city
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
        msg: `Do you need a flight?` 
      };
    }
  },
  {
    expr: /flight|yes/gi,
    prefix: `Searching flights using Amadeus...`,
    handler: async(session, msg) => {
      if (!session.city || !session.geocode) {
        return {
          msg: `You haven't chosen a city. Where do you want to fly? E.g San Francisco from 10-10 to 10-15`
        };
      }
      const city = session.city
      if (!session.startdate) {
        return {
          msg: `When do you want to stay? E.g. 10-10 to 10-15`
        };
      }
      const fare = await amadeus.findFare({
        origin: 'BOS',
        dest: session.destairport,
        depart: session.startdate.format("YYYY-MM-DD"),
        ret: session.enddate.format("YYYY-MM-DD")
      });
      if (fare) {
        fare.in.cost = '$' + ((10000 + Math.random() * 10000) / 100).toFixed(2);
        fare.out.cost = '$' + ((10000 + Math.random() * 10000) / 100).toFixed(2);
        console.log(fare);
        var object =  {
          msg: [`Do you need an uber to the airport?`],
          fare
        };
        console.log(object);
        return object;
      } else {
        return {
          msg: `Couldn't find a flight. Ask for a different location.`,
          fare
        };
      }
    }
  }

];

export default function(session, msg) {
  for (let i = 0; i < handlers.length; i++) {
    if (handlers[i].expr.test(msg)) {
      handlers[i].expr = new RegExp(handlers[i].expr);
      let ret = {
        executor: handlers[i].handler(session, msg)
      };
      if (handlers[i].prefix) {
        ret.prefix = handlers[i].prefix;
      }
      return ret;
    }
  }
  return {
    executor: P.resolve({
      msg: `Cool! You said ${msg}`
    })
  };
}
