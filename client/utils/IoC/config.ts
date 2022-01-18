import "reflect-metadata";
import { GameManager } from "../GameManager";
import { RequestSender } from "../RequestSender";
import { container } from "./Container";
import { Services } from "./Services";

container
  .bind<GameManager>(Services.GameManager)
  .to(GameManager)
  .inSingletonScope();

container
  .bind<RequestSender>(Services.RequestSender)
  .to(RequestSender)
  .inSingletonScope();
