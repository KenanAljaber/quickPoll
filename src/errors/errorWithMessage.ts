export default class ErrorWithMessage extends Error {
    public statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
  
      // Set the prototype explicitly.
      Object.setPrototypeOf(this, ErrorWithMessage.prototype);
    }
  }
  