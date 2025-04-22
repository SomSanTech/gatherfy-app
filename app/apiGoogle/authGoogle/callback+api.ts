import { APP_SCHEME, BASE_URL } from "@/utils/constants";

export async function GET(request: Request) {
  const imcomingParams = new URLSearchParams(request.url.split("?")[1]);
  const combinedPlatformAndState = imcomingParams.get("state");

  if (!combinedPlatformAndState) {
    return Response.json({ error: "Invalid state" }, { status: 400 });
  }

  // strip platform to return state as it was set on the client
  const platform = combinedPlatformAndState.split("|")[0];
  const state = combinedPlatformAndState.split("|")[1];

  const outgointParams = new URLSearchParams({
    code: imcomingParams.get("code")?.toString() || "",
    state,
  });

  return Response.redirect(
    (platform === "web" ? BASE_URL : APP_SCHEME) +
      "?" +
      outgointParams.toString()
  );
}
