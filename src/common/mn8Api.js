export default class mn8Api {
  constructor() {
    this.rootUrl = 'http://emanate.dev.decentrawise.com:85';
  }

  /**
   * Create Request
   */
  createRequest(apiFunction, data) {
    return fetch(`${this.rootUrl}/${apiFunction}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  /**
   * Propose
   */
  propose() {
    var testData = {
      "proposer": "blaketest1",
      "proposal_name": "testcontract1",
      "price": 10000,
      "filename": "test_file_name_1",
      "requested": [
          {
              "name": "blakecollaborator1",
              "percentage": 30,
              "filename": "test_file_name_1",
              "accepted": 0
          }
      ]
    };

    return this.createRequest('propose', testData);
  }

  /**
   * Accept Proposal
   */
  accept() {
    var testData = {
      "proposer": "colabuser1",     //  Creator of the proposal
      "proposal_name": "contract1", //  Name of the proposal
      "approver": "colabuser2"      //  User that needs to accept or reject the proposal
    };

    return this.createRequest('accept', testData);
  }

  /**
   * Reject Proposal
   */
  reject() {
    var testData = {
      "proposer": "colabuser1",       //  Creator of the proposal
      "proposal_name": "contract1",   //  Name of the proposal
      "unapprover": "colabuser2"      //  User that needs to accept or reject the proposal
    };

    return this.createRequest('reject', testData);
  }

  /**
   * Execute Contract
   */
  execute() {
    var testData = {
      "proposer": "colabuser1", //  Creator of the proposal
      "proposal_name": "user1", //  Name of the proposal
      "executor": "colabuser2", //  User that listens to the track
      "seconds": 10             //  Number of seconds to charge the executor
    };

    return this.createRequest('execute', testData);
  }

  /**
   * Add Track
   */
  addTrack() {
    var testData = {
      "owner": "collabuser1",                     //  The owner of the track
      "title": "This is a song 2",
      "metadata":                                 //  All relevant data for the track
      {
          "trackName": "This is track 3",         //  The name of the track
          "artistName": "Look, I'm an artist...",  //  The artist that made this track
          "meta 21": "some metadata here",        //  Add the metadata necessary for this track
          "meta 2": "some more metadata"
      }
    };

    return this.createRequest('addTrack', testData);
  }

  /**
   * Get Contract
   */
  getContract() {
    var testData = {
      "proposer": "colabuser2",
      "contract": "contract1"
    };

    return this.createRequest('getContract', testData);
  }

  /**
   * Get Statistics
   */
  getStatistics() {
    var testData = {
      "owner": "user1", //   The user that you want to get the tracks from
    };

    return this.createRequest('getStatistics', testData);
  }

  /**
   * Start Playing
   */
  startPlaying() {
    var testData = {
      "owner": "user1",           //  The owner of the track
      "title": "This is a song 2" //  The title of the track
    };

    return this.createRequest('startPlaying', testData);
  }

  /**
   * Remove Track
   */
  removeTrack() {
    var testData = {
      "owner": "user1",           //  The owner of the track
      "title": "This is a song 2" //  The title of the track
    };

    return this.createRequest('removeTrack', testData);
  }
}