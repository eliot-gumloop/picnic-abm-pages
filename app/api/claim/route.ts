import { NextResponse } from "next/server";
import { z } from "zod";

const claimSchema = z.object({
  name: z.string().trim().min(1, "Please fill in every field."),
  email: z.email("Please enter a valid email address."),
  address: z.string().trim().min(1, "Please fill in every field."),
  snacks: z
    .array(z.string().trim().min(1))
    .min(1, "Please choose at least one snack above."),
});

const configSchema = z.object({
  apiKey: z.string().min(1),
  userId: z.string().min(1),
  savedItemId: z.string().min(1),
  projectId: z.string().min(1).optional(),
});

function getConfig() {
  const parsed = configSchema.safeParse({
    apiKey: process.env.GUMLOOP_API_KEY,
    userId: process.env.GUMLOOP_USER_ID,
    savedItemId: process.env.GUMLOOP_SAVED_ITEM_ID,
    projectId: process.env.GUMLOOP_PROJECT_ID || undefined,
  });
  return parsed.success ? parsed.data : null;
}

export async function POST(request: Request) {
  const config = getConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Claim webhook is not configured." },
      { status: 500 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = claimSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const { name, email, address, snacks } = parsed.data;

  const pipelinePayload: Record<string, unknown> = {
    user_id: config.userId,
    saved_item_id: config.savedItemId,
    name,
    email,
    address,
    snacks,
  };
  if (config.projectId) {
    pipelinePayload.project_id = config.projectId;
  }

  const pipelineRes = await fetch("https://api.gumloop.com/api/v1/start_pipeline", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "x-auth-key": config.userId,
    },
    body: JSON.stringify(pipelinePayload),
  });

  if (!pipelineRes.ok) {
    const detail = await pipelineRes.text().catch(() => "");
    console.error("Gumloop start_pipeline failed", pipelineRes.status, detail);
    return NextResponse.json(
      { error: "Could not submit your claim. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
