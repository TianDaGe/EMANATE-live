import _ from 'lodash';

export default class mn8Api {
  constructor() {
    this.rootUrl = 'http://emanate.dev.decentrawise.com:85/v1';
    this.user = null;
  }

  /**
   * Create Request
   */
  createRequest(apiFunction, method, data) {
    // Does the request URL require authtoken?
    let requestUrl = apiFunction === 'authenticate' ? `${this.rootUrl}/${apiFunction}` :
        `${this.rootUrl}/${apiFunction}?auth-token=${this.user.token}`;

    // Pass empty object if data is not passed
    data = data ? data : {};

    let requestObj = {
      method: method ? method : 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Extend request object to include body (if applicable)
    if (method !== 'GET') {
      requestObj = _.assignIn(requestObj, {body: JSON.stringify(data)});
    }

    console.log("Request Obj", requestObj);

    // Fetch
    return fetch(requestUrl, requestObj);
  }

  // TODO :: Extract user in to its own service
  setUser(id, token) {
    this.user = {
      id: id,
      token: token
    };

    console.info(`User set: ${this.user.id} :: ${this.user.token}`);
  }

  authenticate(data) {
      var authData = {
        user: data.username,
        password: data.password
      };

      return this.createRequest('authenticate', 'POST', authData)
        .then((res) => res.json())
        .then((res) => {
          this.setUser(data.username, res.data.token);
          return res;
        });
  }

  /**
   * Propose
   */
  propose(data) {
    if (this.user === null) {
      console.warn("User is not set, you can not call authorised functions.");
    }

    let apiFunction = `user/${this.user.id}/collab`,
        proposeData = {
          parameters: {
            "proposal_name": data["proposal_name"],
            "price": data["price"],
            "filename": data["final_filename"],
            "requested": [
              {
                "name": data["partner_name"],
                "percentage": data["partner_percentage"],
                "filename": data["collab_filename"],
                "accepted": 0
              }
            ]
          }
        };

    return this.createRequest(apiFunction, 'POST', proposeData);
  }

  /**
   * Cancel contract
   */
  cancel(data) {
    if (this.user === null) {
      console.warn("User is not set, you can not call authorised functions.");
    }

    let apiFunction = `user/${this.user.id}/collab`,
        cancelData = {
          parameters: {
              "proposer": data["proposer"],
              "proposal_name": data["proposal_name"]
          }
        };

    return this.createRequest(apiFunction, 'DELETE', cancelData);
  }

  /**
   * Get contracts
   */
  getContracts() {
    if (this.user === null) {
      console.warn("User is not set, you can not call authorised functions.");
    }

    let apiFunction = `user/${this.user.id}/collab`;

    return this.createRequest(apiFunction, 'GET');
  }

  /**
  * Accept collab
  */
  accept(data) {
    if (this.user === null) {
      console.warn("User is not set, you can not call authorised functions.");
    }

    let apiFunction = `user/${this.user.id}/collab/accept`,
        acceptData = {
          parameters: {
            "proposer": data["proposer"],
            "proposal_name": data["proposal_name"]
          }
        };

    return this.createRequest(apiFunction, 'PUT', acceptData);
  }

  /**
  * Reject collab
  */
  reject(data) {
    if (this.user === null) {
      console.warn("User is not set, you can not call authorised functions.");
    }

    let apiFunction = `user/${this.user.id}/collab/reject`,
        rejectData = {
          parameters: {
            "proposer": data["proposer"],
            "proposal_name": data["proposal_name"]
          }
        };

    return this.createRequest(apiFunction, 'PUT', rejectData);
  }

  /**
  * Pay
  */
  pay(data) {
    if (this.user === null) {
      console.warn("User is not set, you can not call authorised functions.");
    }

    let apiFunction = `user/${this.user.id}/collab/pay`,
        payData = {
          parameters: {
            "proposer": data["proposer"],
            "proposal_name": data["proposal_name"],
            "seconds": data["seconds"]
          }
        };

    return this.createRequest(apiFunction, 'PUT', payData);
  }

  /**
  * addAsset
  */
  addAsset(data) {
    if (this.user === null) {
      console.warn("User is not set, you can not call authorised functions.");
    }

    let apiFunction = `user/${this.user.id}/asset`,
        addAssetData = {
          parameters: {
            "title": data["title"],
            "metadata": {
                "trackName": data["title"],
                "artistName": data["artist_name"]
            }
          }
        };

    return this.createRequest(apiFunction, 'POST', addAssetData);
  }

  /**
  * getAssets
  */
  getAssets() {
    if (this.user === null) {
      console.warn("User is not set, you can not call authorised functions.");
    }

    let apiFunction = `user/${this.user.id}/asset`;

    return this.createRequest(apiFunction, 'GET');
  }

  /**
  * removeAsset
  */
  removeAsset(data) {
    if (this.user === null) {
      console.warn("User is not set, you can not call authorised functions.");
    }

    let apiFunction = `user/${this.user.id}/asset`,
        removeAssetData = {
          parameters: {
            "title": data["title"],
          }
        };

    return this.createRequest(apiFunction, 'DELETE', removeAssetData);
  }

  /**
  * getStats
  */
  getStats(data) {
    if (this.user === null) {
      console.warn("User is not set, you can not call authorised functions.");
    }

    let apiFunction = `user/${this.user.id}/asset/statistics`;

    return this.createRequest(apiFunction, 'GET');
  }

  /**
  * listen
  */
  listen(data) {
    if (this.user === null) {
      console.warn("User is not set, you can not call authorised functions.");
    }

    let listenTitle = data["title"],
        apiFunction = `user/${this.user.id}/asset/play/${listenTitle}`;

    return this.createRequest(apiFunction, 'PUT');
  }


}