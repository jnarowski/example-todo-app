import { defineWorkflow } from "agentcmd-workflows";

/**
 * Preview Only Workflow (Test)
 *
 * Minimal workflow that only spins up a preview container.
 * Used for testing the step.preview() feature in isolation.
 */
export default defineWorkflow(
  {
    id: "preview-only",
    name: "Preview Only (Test)",
    description: "Spins up a preview container - for testing purposes",
    phases: [{ id: "preview", label: "Preview" }],
  },
  async ({ step }) => {
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
  }
);
