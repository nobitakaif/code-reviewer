
export abstract class GitHubAuthService{
    static async githubCallback({ code } : { code : string }) {
        const userAccessToken = await fetch("https://github.com/login/oauth/access_token",{
            method : "POST", 
            headers: {
                "Content-Type": "application/json",
                Accept : "application/json",
            },
            body : JSON.stringify({
                client_id : process.env.GITHUB_CLIENT_ID!,
                client_secret : process.env.GITHUB_CLIENT_SECRET!,
                code : code 
            }),
            
        })
        
        const resUserAccessToken = await userAccessToken.json()
        
        const accessToken = resUserAccessToken.access_token

        const userData = await fetch("https://api.github.com/user",{
            headers : {
                Authorization : `Bearer `
            }
        })
        
        console.log(resUserAccessToken)
    }
}