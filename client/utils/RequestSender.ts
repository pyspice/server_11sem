import { injectable } from "inversify";
import { ActionResult } from "../types";

export type RoundInfo = {
  word?: string;
  attempts?: number;
  wordsLeft?: boolean;
};

export enum ServerStateLabel {
  BEFORE_START = "BEFORE_START",
  ROUND_RUNNING = "ROUND_RUNNING",
  ROUND_ENDED = "ROUND_ENDED",
}

export enum ClientAction {
  TRY = "TRY",
  SURRENDER = "SURRENDER",
  NEXT_ROUND = "NEXT_ROUND",
}

export type ServerState = {
  state: ServerStateLabel;
} & RoundInfo;

export type ServerResponse = {
  action: ActionResult;
} & RoundInfo;

export type ClientQuery = {
  action: ClientAction;
  letter?: string;
};

@injectable()
export class RequestSender {
  private readonly SERVER_URL = window.location.origin;
  private readonly STATE_ENDPOINT = `${this.SERVER_URL}/state`;
  private readonly ACTION_ENDPOINT = `${this.SERVER_URL}/action`;

  fetchState(): Promise<ServerState> {
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

        let body: ServerState;
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

  postAction(action: ClientQuery): Promise<ServerResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        const request = new Request(this.ACTION_ENDPOINT, {
          method: "POST",
          credentials: "same-origin",
          headers: [
            ["Accept", "application/json"],
            ["Content-Type", "application/json"],
          ],
          body: JSON.stringify(action),
        });
        const response = await fetch(request);

        let body: ServerResponse;
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
