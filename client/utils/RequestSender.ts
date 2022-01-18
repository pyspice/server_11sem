import { injectable } from "inversify";

export type Info = {};

export type ServerState = {};

@injectable()
export class RequestSender {
  private readonly SERVER_URL = window.location.origin;
  private readonly STATE_ENDPOINT = `${this.SERVER_URL}/state`;
  private readonly TRY_ENDPOINT = `${this.SERVER_URL}/try`;

  fetchState() {
    return new Promise(async (resolve, reject) => {
      try {
        const request = new Request(this.STATE_ENDPOINT, {
          method: "POST",
          credentials: "same-origin",
          headers: [
            ["Accept", "application/json"],
            ["Content-Type", "application/json"],
          ],
        });
        const response = await fetch(request);

        let body: any;
        const text = await response.text();
        if (text) {
          body = JSON.parse(text);
        }

        resolve(body);
      } catch (error) {
        reject(error);
      }
    });
  }
}
