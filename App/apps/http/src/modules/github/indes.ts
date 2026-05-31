import { prisma } from "@repo/db/client";
import Elysia, { t } from "elysia";

export const github = new Elysia({prefix : "/github"})
    
    .post("/webhook", async ({ body, headers, }) => {

    const event = headers["x-github-event"];

    const payload  = body

    console.log(event);
    
    console.log(payload)

    const res = await prisma.gitHubInstallation.create({
        data : {
            githubInstalltionId : payload?.installation.id,
            accountLogin : payload?.installation?.account.login.toString(),
            accountType : payload?.installation?.account.type.toString(),
            userId : "cmptbmorr0000xou2onvw6uvn"
        }
    })
    
    console.log(res.id)

    return {
        ok: true,
        id : res.id
    };
},{
    body : t.Any()
})