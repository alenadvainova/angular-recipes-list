export class User {
  constructor(
    public email: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    private _userId: string
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
