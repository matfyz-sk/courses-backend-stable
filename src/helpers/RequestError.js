export default class RequestError extends Error {
   constructor(message, responseCode) {
      super(message);
      this.name = "RequestError";
      this.responseCode = responseCode;
   }
}
