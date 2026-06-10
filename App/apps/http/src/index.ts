import { Elysia } from "elysia";
import { userAuth } from "./module/user";

const app = new Elysia({ prefix : "/api/v1"})
  .use(userAuth)
  .get("/", () => "Hello Elysia").listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
