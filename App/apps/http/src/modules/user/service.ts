import { prisma } from "@repo/db/client";

export abstract class AuthService{
    static async loginUser({code} : {code : string}){
        // fecthing accesstoken of uuser
        const response = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            })
        });

        const data = await response.json();
        
        const userRes = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${data.access_token}`,
                Accept: "application/vnd.github+json"
            }
        });
        const user = await userRes.json();

        const emailRes = await fetch("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${data.access_token}`,
                Accept: "application/vnd.github+json"
            }
        });

        const emails = await emailRes.json();

        console.log(emails[0].email)
        
        console.log(user.name)
        console.log(user.avatar_url)
        
        const res = await prisma.user.upsert({
            where: {
                githubId: user.id.toString()
            },
            create: {
                githubId: user.id.toString(),
                name: user.name,
                email: emails[0]?.email,
                avatarUrl: user.avatar_url
            },
            update: {
                name: user.name,
                email: emails[0]?.email,
                avatarUrl: user.avatar_url
            }
        });

        return {
            data,
            code,
            user,
            emails,
            id : res.id
        }
    }
}