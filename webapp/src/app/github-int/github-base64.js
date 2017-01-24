class GithubBase64 {
    constructor() {
        this.Base64 = { encode: window.btoa };
    }
}

export default (new GithubBase64());
