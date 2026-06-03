import { prisma } from "@repo/db/client";
import Elysia, { t } from "elysia";

export const github = new Elysia({ prefix: "/github" })
.post(
  "/webhook",
  async ({ body, headers }) => {

    const event = headers["x-github-event"];

    console.log("Event:", event);

    const installationId = body.installation?.id;

    if (!installationId) {
      console.log("No installation id");
      return { ok: false };
    }

    // Find installation
    const githubInstallation =
      await prisma.gitHubInstallation.findUnique({
        where: {
          githubInstalltionId: installationId,
        },
      });

    if (!githubInstallation) {
      console.log(
        "Installation not found:",
        installationId
      );

      return {
        ok: false,
        message: "Installation not registered",
      };
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        id: githubInstallation.userId,
      },
    });

    console.log("User:", user);

    if (!user) {
      return {
        ok: false,
        message: "User not found",
      };
    }

    // Handle PR events
    if (event === "pull_request") {

      const repo = body.repository;

      await prisma.repository.upsert({
        where: {
          githubRepoId: repo.id.toString(),
        },
        create: {
          githubRepoId: repo.id.toString(),
          installationId: githubInstallation.id,
          owner: repo.owner.login,
          name: repo.name,
          fullName: repo.full_name,
          private: repo.private,
        },
        update: {
          owner: repo.owner.login,
          name: repo.name,
          fullName: repo.full_name,
          private: repo.private,
        },
      });

      console.log(
        `PR #${body.pull_request.number} opened`
      );
    }

    return {
      ok: true,
    };
  },
  {
    body: t.Any(),
  }
);