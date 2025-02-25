import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { storage } from "../storage";

const router = Router();

const gmailClient = new OAuth2Client(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI,
);

router.get("/auth/gmail", (req, res) => {
  const authUrl = gmailClient.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
    ],
  });
  res.redirect(authUrl);
});

router.get("/auth/gmail/callback", async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    return res.redirect("/onboarding?gmailConnected=false");
  }

  try {
    const { tokens } = await gmailClient.getToken(code);
    if (!tokens.access_token) {
      throw new Error("No access token received");
    }

    await storage.setGmailToken(tokens.access_token);

    // Redirect back to onboarding page
    res.redirect("/onboarding?gmailConnected=true");
  } catch (error) {
    console.error("Gmail auth error:", error);
    res.redirect("/onboarding?gmailConnected=false");
  }
});

router.get("/auth/gmail/status", async (req, res) => {
  try {
    const token = await storage.getGmailToken();
    res.json({ connected: !!token });
  } catch (error) {
    console.error("Error checking Gmail status:", error);
    res.json({ connected: false });
  }
});

// Add WhatsApp auth routes
router.get("/auth/whatsapp", (req, res) => {
  // Replace with your actual WhatsApp Business API auth URL
  const whatsappAuthUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.WHATSAPP_APP_ID}&redirect_uri=${process.env.WHATSAPP_REDIRECT_URI}&scope=whatsapp_business_messaging`;
  res.redirect(whatsappAuthUrl);
});

router.get("/auth/whatsapp/callback", async (req, res) => {
  // Handle WhatsApp auth callback and store token
  const code = req.query.code as string;
  if (!code) {
    return res.redirect("/onboarding?whatsappConnected=false");
  }

  // Replace with your actual WhatsApp Business API token retrieval logic
  try {
    // ... fetch token ...
    await storage.setWhatsAppToken(token);
    res.redirect("/onboarding?whatsappConnected=true");
  } catch (error) {
    console.error("WhatsApp auth error:", error);
    res.redirect("/onboarding?whatsappConnected=false");
  }
});

router.get("/auth/whatsapp/status", async (req, res) => {
  try {
    const token = await storage.getWhatsAppToken();
    res.json({ connected: !!token });
  } catch (error) {
    console.error("Error checking WhatsApp status:", error);
    res.json({ connected: false });
  }
});

// Add Slack auth routes
router.get("/auth/slack", (req, res) => {
  // Replace with your actual Slack auth URL
  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=channels:read,chat:write&redirect_uri=${process.env.SLACK_REDIRECT_URI}`;
  res.redirect(slackAuthUrl);
});

router.get("/auth/slack/callback", async (req, res) => {
  // Handle Slack auth callback and store token
  const code = req.query.code as string;
  if (!code) {
    return res.redirect("/onboarding?slackConnected=false");
  }

  // Replace with your actual Slack token retrieval logic
  try {
    // ... fetch token ...
    await storage.setSlackToken(token);
    res.redirect("/onboarding?slackConnected=true");
  } catch (error) {
    console.error("Slack auth error:", error);
    res.redirect("/onboarding?slackConnected=false");
  }
});

router.get("/auth/slack/status", async (req, res) => {
  try {
    const token = await storage.getSlackToken();
    res.json({ connected: !!token });
  } catch (error) {
    console.error("Error checking Slack status:", error);
    res.json({ connected: false });
  }
});

export { router as authRouter };
