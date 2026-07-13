import { put, list } from "@vercel/blob";
import fs from "fs";
import path from "path";

export interface User {
  email: string;
  name: string;
  phone: string;
  createdAt: string;
}

// Local fallback file path
const LOCAL_DB_PATH = path.join(process.cwd(), "users_local.json");

function getBlobCredentials() {
  let token = process.env.BLOB_READ_WRITE_TOKEN_NEW_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || "";
  let storeId = process.env.BLOB_READ_WRITE_TOKEN_NEW_STORE_ID || process.env.BLOB_STORE_ID || "";

  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }
  if (storeId.startsWith('"') && storeId.endsWith('"')) {
    storeId = storeId.slice(1, -1);
  }

  return { token, storeId };
}

async function getBlobUrl(): Promise<string | null> {
  const { token, storeId } = getBlobCredentials();
  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
    return null;
  }
  try {
    const { blobs } = await list({ token, storeId });
    const userBlob = blobs.find((b) => b.pathname === "users.json");
    return userBlob ? (userBlob.downloadUrl || userBlob.url) : null;
  } catch (e) {
    console.error("Vercel Blob list error (will fall back to local file):", e);
    return null;
  }
}

// Helper to read local database fallback
function getLocalUsers(): User[] {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
      return JSON.parse(data) as User[];
    }
  } catch (err) {
    console.error("Failed to read local users fallback:", err);
  }
  return [];
}

// Helper to write local database fallback
function saveLocalUsers(users: User[]): void {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write local users fallback:", err);
  }
}

export async function getUsers(): Promise<User[]> {
  const blobUrl = await getBlobUrl();
  if (!blobUrl) {
    return getLocalUsers();
  }

  try {
    const response = await fetch(blobUrl);
    if (!response.ok) {
      console.warn(`Fetch users from Blob failed with status ${response.status}. Falling back to local file.`);
      return getLocalUsers();
    }
    return (await response.json()) as User[];
  } catch (e) {
    console.error("Failed to fetch users from Vercel Blob. Falling back to local file:", e);
    return getLocalUsers();
  }
}

export async function saveUsers(users: User[]): Promise<void> {
  // Always update the local fallback database first
  saveLocalUsers(users);

  const { token, storeId } = getBlobCredentials();
  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
    return;
  }

  try {
    await put("users.json", JSON.stringify(users, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControl: "no-store, no-cache, must-revalidate, max-age=0",
      token,
      storeId,
    });
  } catch (e) {
    console.error("Failed to put users to Vercel Blob (local file updated successfully):", e);
  }
}
