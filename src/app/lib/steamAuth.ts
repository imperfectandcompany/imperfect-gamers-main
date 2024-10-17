// src/app/lib/steamAuth.ts

import axios from "axios";

export const generateSteamLoginURL = (
  returnURL: string,
  type: "popup" | "redirect" = "popup"
) => {
  const openIDURL = "https://steamcommunity.com/openid/login";
  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": `${returnURL}?type=${type}`,
    "openid.realm": new URL(returnURL).origin,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });
  return `${openIDURL}?${params.toString()}`;
};

/**
 * Performs direct verification with Steam's OpenID endpoint.
 *
 * @param params - URLSearchParams containing the OpenID response from Steam
 * @returns A boolean indicating whether the verification was successful
 */
export async function directVerificationWithSteam(
  params: URLSearchParams
): Promise<boolean> {
  const opEndpoint = params.get("openid.op_endpoint");
  if (!opEndpoint) {
    console.error("OpenID endpoint not found in params");
    return false;
  }

  params.set("openid.mode", "check_authentication");

  try {
    const verificationResponse = await fetch(opEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!verificationResponse.ok) {
      console.error("Failed to post verification request to Steam.");
      return false;
    }

    const responseText = await verificationResponse.text();
    return responseText.includes("is_valid:true");
  } catch (error) {
    console.error("Error during direct verification with Steam:", error);
    return false;
  }
}

/**
 * Verifies the Steam user's assertion and returns the user's identity.
 *
 * @param query - The query parameters returned by Steam after user authentication.
 * @returns A string representing the user's Steam ID, or null if the verification fails.
 */
export async function verifySteamAssertion(
  query: URLSearchParams
): Promise<string | null> {
  try {
    if (query.get("openid.mode") !== "id_res") {
      console.error("Invalid mode in Steam response");
      return null;
    }

    const claimedId = query.get("openid.claimed_id");
    if (!claimedId) {
      throw new Error("Claimed ID not found in Steam response");
    }

    const steamIdMatch = claimedId.match(
      /^https:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/
    );
    if (!steamIdMatch) {
      throw new Error("Invalid Steam ID format");
    }
    // INVESTIGATE WHY THIS ONLY WORKS 80% OF THE TIME. SPORADIC/SPECIAL CAUSE WHAT CATEGORIZE VARIATION
    const isValid = await directVerificationWithSteam(query);
    if (!isValid) {
      throw new Error("Steam OpenID verification failed");
    }

    return steamIdMatch[1]; // Return the Steam ID as a string
  } catch (error) {
    console.error("Error verifying Steam assertion:", error);
    return null;
  }
}
