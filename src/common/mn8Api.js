import _ from 'lodash';
import { generateRandString } from './utils';

export default class mn8Api {
  constructor() {
    this.rootUrl = 'http://emanate.dev.decentrawise.com:85/v1';
    this.user = {
      id: 'user11',
      token: null
    };
    this.activeCollab = {};
  }

  /**
   * Create Request
   */
  createRequest(apiFunction, method, authToken, data) {
    // Does the request URL require authtoken?
    let requestUrl = `${this.rootUrl}/${apiFunction}`;

    // Pass empty object if data is not passed
    data = data ? data : {};

    let requestObj = {
      method: method ? method : 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Add token to the headers
    if (authToken) {
      requestObj.headers['auth-token'] = authToken;
    }

    // Extend request object to include body (if applicable)
    if (method !== 'GET') {
      requestObj = _.assignIn(requestObj, {body: JSON.stringify(data)});
    }

    // Fetch
    return fetch(requestUrl, requestObj)
      .then((res) => res.json());
  }

  /**
   * Set user - TODO: Temporary
   */
  setUser(id, token) {
    this.user = {
      id: id,
      token: token
    };
  }


  /**
   * Authenticate - Must run before ALL other API calls
   */
  authenticate() {
      return this.createRequest('authenticate', 'POST')
        .then((res) => {
          this.setUser('user11', res.data.token);
          return res.data.token;
        });
  }

  /**
   * Propose
   */
  propose(data, spoof) {
    // Spoof all data besides proposal_name
    if (spoof) {
      data["proposal_name"] = data["proposal_name"] ? data["proposal_name"] : generateRandString("propname", 2);
      data["price"] = 10000;
      data["partner_name"] = 'user12';
      data["partner_percentage"] = 50;
      data["final_filename"] = generateRandString("finalfname", 2);
      data["collab_filename"] = generateRandString("collabfname", 2);
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

    return this.authenticate().then( (authToken) => {
      return this.createRequest(apiFunction, 'POST', authToken, proposeData)
        .then((res) => {
          if (res && res.success) {
            res.data["hash"] = btoa(JSON.stringify({ user: this.user.id, contract: res.data.name }));
            return res;
          }

          return res;
        });
    });
  }

  /**
   * Cancel contract
   */
  cancel(data) {
    if (data.partner_user === null) {
      console.warn("User is not set, you can not call authorised functions.");
    }

    let apiFunction = `user/${data.partner_user}/collab`,
        cancelData = {
          parameters: {
              "proposer": data["proposer"],
              "proposal_name": data["proposal_name"]
          }
        };

    return this.authenticate().then( (authToken) => {
      return this.createRequest(apiFunction, 'DELETE', authToken, cancelData);
    });
  }

  /**
   * Get contracts
   */
  getContracts(data) {
    let user = data ? data.user : this.user.id,
        apiFunction = `user/${user}/collab`;

    return this.authenticate().then( (authToken) => {
      return this.createRequest(apiFunction, 'GET', authToken);
    });
  }

  /**
   * Get single contract
   */
  getContract(data) {
    let user = data ? data.user : this.user.id,
        contract = data ? data.contract : null,
        apiFunction = `user/${user}/collab/${contract}`;

    return this.authenticate().then( (authToken) => {
      return this.createRequest(apiFunction, 'GET', authToken);
    });
  }

  /**
  * Accept collab
  */
  accept(data) {
    if (data.partner_user === null) {
      console.warn("Partner user is not set.");
    }

    let apiFunction = `user/${data.partner_user}/collab/accept`,
        acceptData = {
          parameters: {
            "proposer": data["proposer"],
            "proposal_name": data["proposal_name"]
          }
        };

    return this.authenticate().then( (authToken) => {
      return this.createRequest(apiFunction, 'PUT', authToken, acceptData);
    });
  }

  /**
  * Reject collab
  */
  reject(data) {
    if (data.partner_user === null) {
      console.warn("Partner user is not set.");
    }

    let apiFunction = `user/${data.partner_user}/collab/reject`,
        rejectData = {
          parameters: {
            "proposer": data["proposer"],
            "proposal_name": data["proposal_name"]
          }
        };

    return this.authenticate().then( (authToken) => {
      return this.createRequest(apiFunction, 'PUT', authToken, rejectData);
    });
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

    return this.authenticate().then( (authToken) => {
      return this.createRequest(apiFunction, 'PUT', authToken, payData);
    });
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

    return this.authenticate().then( (authToken) => {
      return this.createRequest(apiFunction, 'POST', authToken, addAssetData);
    });
  }

  /**
  * getAssets
  */
  getAssets() {
    if (this.user === null) {
      console.warn("User is not set, you can not call authorised functions.");
    }

    let apiFunction = `user/${this.user.id}/asset`;

    return this.authenticate().then( (authToken) => {
      return this.createRequest(apiFunction, 'GET', authToken);
    });
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

    return this.authenticate().then( (authToken) => {
      return this.createRequest(apiFunction, 'DELETE', authToken, removeAssetData);
    });
  }

  /**
  * getStats
  */
  getStats(data) {
    if (this.user === null) {
      console.warn("User is not set, you can not call authorised functions.");
    }

    let apiFunction = `user/${this.user.id}/asset/statistics`;

    return this.authenticate().then( (authToken) => {
      return this.createRequest(apiFunction, 'GET', authToken);
    });
  }

  /**
  * listen
  */
  listen(data) {
    if (this.user === null) {
      console.warn("User is not set, you can not call authorised functions.");
    }

    let listenTitle = data["title"],
        apiFunction = `user/user25/asset/play/${listenTitle}`;

    return this.authenticate().then( (authToken) => {
      return this.createRequest(apiFunction, 'PUT', authToken);
    });
  }
}