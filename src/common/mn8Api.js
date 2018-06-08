export default class mn8Api {
  constructor() {
    this.rootUrl = 'http://casam2.ddns.net:85';
  }

  createRequest(apiFunction, data) {
    return fetch(`${this.rootUrl}/${apiFunction}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => {
      console.log("RESPONSE", res);
    }).catch((err) => {
      console.log("ERROR", err);
    });
  }

  propose() {
    var testData = {
        "from": "collabuser1",
        "name": "blaketesta",
        "price": 10000,
        "filename": "blaketestname",
        "partners": [{
    	   "name": "collabuser2",
           "percentage": 50,
           "filename": "blakepartner",
           "accepted": 0
        }]
    };

    return createRequest('propose', testData);
  }
}