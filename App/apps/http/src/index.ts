
import { Elysia } from "elysia";
import { userAuth } from "./modules/user";
import { github } from "./modules/github/indes";

const app = new Elysia({prefix : "/api/v1"})
  .use(userAuth)
  .get("/test", function(){
    return {
      Hello : "world"
    }
  })
  .use(github)
  .listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
