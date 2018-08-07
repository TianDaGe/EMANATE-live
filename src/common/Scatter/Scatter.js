export default class Scatter {
  constructor() {
    this.identity = null;
    this.getIdentity = this.getIdentity.bind(this);

    return this.initiateScatter();
  }

  initiateScatter() {
    return new Promise((resolve, reject) => {
      let timeoutleng = 3000;

      // Initiate scatter
      document.addEventListener('scatterLoaded', scatterExtension => {
          this.scatter = window.scatter;
          window.scatter = null;
          clearTimeout(scatterTimeout);
          this.checkForExistingIdentity();
          resolve(this);
      });

      // Reject after 3 seconds, scatter likely not available
      let scatterTimeout = setTimeout(() => {
          this.scatter = null;
          document.removeEventListener('scatterLoaded', null, true);
          reject(this);
      }, timeoutleng);
    });
  }

  checkForExistingIdentity(scatter) {
    if (this.scatter !== undefined && this.scatter.identity !== undefined) {
        this.identity = this.scatter.identity;
        // return this.identity;
    }
  }

  getIdentity() {
    this.checkForExistingIdentity();

    return this.scatter.getIdentity({
        personal:['firstname', 'lastname'],
        location:['country']
    }).then(iden => {
      this.identity = iden;
      console.log('fetched', this.identity);
      return iden;
    }).catch(error => {
      console.warn("Scatter indentity request failed", error);
    });
  }
}
