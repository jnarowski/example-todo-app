import { defineWorkflow } from "agentcmd-workflows";
import {
  buildSlashCommand,
  type CmdCreatePrResponse,
  type CmdImplementSpecResponse,
  type CmdReviewSpecImplementationResponse,
} from "../../generated/slash-commands";

/**
 * Workflow context for sharing state between phases via closure.
 */
interface WorkflowContext {
  implement?: CmdImplementSpecResponse;
  review?: CmdReviewSpecImplementationResponse;
  previewUrl?: string;
}

/**
 * Implement, Review & Preview Workflow
 *
 * Simple workflow that:
 * 1. Implements a spec (single pass)
 * 2. Reviews the implementation (single pass)
 * 3. Spins up a preview container
 * 4. Creates a PR
 *
 * This workflow is designed to test the step.preview() feature.
 */
export default defineWorkflow(
  {
    id: "implement-review-preview",
    name: "Implement, Review & Preview",
    description: "Implements spec, reviews, then spins up preview container",
    phases: [
      { id: "implement", label: "Implement" },
      { id: "review", label: "Review" },
      { id: "preview", label: "Preview" },
      { id: "complete", label: "Complete" },
    ],
  },
  async ({ event, step }) => {
    const { workingDir, specFile } = event.data;
    const ctx: WorkflowContext = {};

    // Phase 1: Implement (single pass)
    await step.phase("implement", async () => {
      const result = await step.agent<CmdImplementSpecResponse>(
        "implement-spec",
        {
          agent: "claude",
          json: true,
          prompt: buildSlashCommand("/cmd:implement-spec", {
            specIdOrNameOrPath: specFile,
          }),
          workingDir,
        }
      );

      ctx.implement = result.data;

      await step.annotation("implement-result", {
        message: `Implementation ${
          result.data.success ? "passed" : "needs work"
        }. ${result.data.summary}`,
      });

      await step.git("commit-implementation", {
        operation: "commit",
        message: `feat: implement ${event.data.name}`,
      });
    });

    // Phase 2: Review (single pass)
    await step.phase("review", async () => {
      const result = await step.agent<CmdReviewSpecImplementationResponse>(
        "review-spec",
        {
          agent: "claude",
          json: true,
          prompt: buildSlashCommand("/cmd:review-spec-implementation", {
            specIdOrNameOrPath: specFile,
            format: "json",
          }),
          workingDir,
        }
      );

      ctx.review = result.data;

      await step.annotation("review-result", {
        message: `Review ${result.data.success ? "passed" : "has findings"}. ${
          result.data.summary
        }`,
      });

      await step.git("commit-review-fixes", {
        operation: "commit",
        message: "chore: address review feedback",
      });
    });

    // Phase 3: Preview
    await step.phase("preview", async () => {
      await step.annotation("preview-start", {
        message: "Starting preview container",
      });

      const previewResult = await step.preview("deploy");

      if (previewResult.success && previewResult.data.urls.PORT) {
        await step.annotation("preview-running", {
          message: `Preview running at ${previewResult.data.urls.PORT}`,
        });

        await step.artifact("preview-info", {
          name: "preview-info.json",
          type: "text",
          content: JSON.stringify(
            {
              containerId: previewResult.data.containerId,
              status: previewResult.data.status,
              urls: previewResult.data.urls,
            },
            null,
            2
          ),
        });
      } else {
        await step.annotation("preview-skipped", {
          message:
            previewResult.error || "Docker not available - preview skipped",
        });
      }
    });

    // Phase 4: Complete
    await step.phase("complete", async () => {
      if (!ctx.implement || !ctx.review) {
        throw new Error("Missing implementation or review data");
      }

      await step.agent("move-spec", {
        agent: "claude",
        prompt: buildSlashCommand("/cmd:move-spec", {
          specIdOrNameOrPath: specFile,
          targetFolder: "done",
        }),
      });

      const prResult = await step.agent<CmdCreatePrResponse>("create-pr", {
        agent: "claude",
        json: true,
        prompt: buildSlashCommand("/cmd:create-pr", {
          title: `feat: ${event.data.name}`,
        }),
      });

      if (!prResult.data.success) {
        throw new Error(`PR creation failed: ${prResult.data.message}`);
      }

      await step.updateRun({ pr_url: prResult.data.pr_url });
    });
  }
);
