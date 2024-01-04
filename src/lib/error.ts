export default class CustomError extends Error {
    public status?: number;

    constructor(message?: string, status?: number, options?: ErrorOptions) {
        super(message, options);
        this.status = status

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}