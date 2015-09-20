const API_KEY = '2c523e84-f770-40c5-a8d4-ab892a32734f';
const customer_id = 'cus_KUulq2MnEoUzMk';

function getAddress(lat, lng) {
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyD3gr4O7fEkT62IDa1N4nN8_BMpVjmYrW8";
        console.log(url);
        request(url, function(error,response,body){
                if (!error && response.statusCode == 200){
                        var result = JSON.parse(body).results;
                        result = result[0];
                        result = result.formatted_address;
                        return result;
                }
        });
}



function getPrice(lat1, lng1, lat2, lng2){
        var lat1 = '40.714224';//pickup
        var lng1 = '-73.961452';//
        var lat2 = '42.714224';//drop
        var lng2 = '-72.961452';
        
        var address1 = getAddress(lat1,lng1);
        var address2 = getAddress(lat2,lng2);
        var address1 = '15 Onondaga Ave, San Francisco, CA 94112';//addresses for now
        var address2 = '22 Onondaga Ave, San Francisco, CA 94112';
        var Postmates = require('postmates');
        var postmates = new Postmates(customer_id, API_KEY);
        var delivery = {
                pickup_address: address1,
                dropoff_address: address2
        };
        postmates.quote(delivery, function(err,res){
                console.log(res);
                console.log(res.body.fee);
        });
}
