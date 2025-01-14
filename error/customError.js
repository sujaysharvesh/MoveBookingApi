export class CustomErrorApi extends Error {
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
    }
}