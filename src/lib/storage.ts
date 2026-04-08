"use client"

const DB_NAME = "jasons-journal-db";
const DB_VERSION = 1;

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  lastModified: string;
  tags?: string[];
  mood?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
}

export interface MediaData {
  skills: { id: string; name: string; description: string; category: string }[];
  socialLinks: { platform: string; url: string; username: string }[];
  contact: { email: string; phone: string; location: string };
}

export interface MailboxMessage {
  id: string;
  from: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      if (!database.objectStoreNames.contains("journal")) {
        database.createObjectStore("journal", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains("gallery")) {
        database.createObjectStore("gallery", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains("media")) {
        database.createObjectStore("media", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains("mailbox")) {
        database.createObjectStore("mailbox", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains("settings")) {
        database.createObjectStore("settings", { keyPath: "id" });
      }
    };
  });
}

export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  const database = await initDB();
  const tx = database.transaction("journal", "readwrite");
  tx.objectStore("journal").put(entry);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllJournalEntries(): Promise<JournalEntry[]> {
  const database = await initDB();
  const tx = database.transaction("journal", "readonly");
  const store = tx.objectStore("journal");
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const database = await initDB();
  const tx = database.transaction("journal", "readwrite");
  tx.objectStore("journal").delete(id);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveGalleryImage(image: GalleryImage): Promise<void> {
  const database = await initDB();
  const tx = database.transaction("gallery", "readwrite");
  tx.objectStore("gallery").put(image);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  const database = await initDB();
  const tx = database.transaction("gallery", "readonly");
  const store = tx.objectStore("gallery");
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMediaData(data: MediaData): Promise<void> {
  const database = await initDB();
  const tx = database.transaction("media", "readwrite");
  tx.objectStore("media").put({ id: "media", ...data });
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getMediaData(): Promise<MediaData | null> {
  const database = await initDB();
  const tx = database.transaction("media", "readonly");
  const store = tx.objectStore("media");
  return new Promise((resolve, reject) => {
    const request = store.get("media");
    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? { skills: result.skills, socialLinks: result.socialLinks, contact: result.contact } : null);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveMessage(message: MailboxMessage): Promise<void> {
  const database = await initDB();
  const tx = database.transaction("mailbox", "readwrite");
  tx.objectStore("mailbox").put(message);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllMessages(): Promise<MailboxMessage[]> {
  const database = await initDB();
  const tx = database.transaction("mailbox", "readonly");
  const store = tx.objectStore("mailbox");
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function exportAllData(): Promise<{
  journal: JournalEntry[];
  gallery: GalleryImage[];
  media: MediaData | null;
  mailbox: MailboxMessage[];
}> {
  const [journal, gallery, media, mailbox] = await Promise.all([
    getAllJournalEntries(),
    getAllGalleryImages(),
    getMediaData(),
    getAllMessages(),
  ]);

  return { journal, gallery, media, mailbox };
}

export async function generateMarkdownExport(): Promise<string> {
  const data = await exportAllData();
  let md = "# Jason's Journal Export\n\n";
  md += `Exported on: ${new Date().toISOString()}\n\n`;

  md += "## Journal Entries\n\n";
  for (const entry of data.journal) {
    md += `### ${entry.title}\n`;
    md += `Date: ${entry.date}\n`;
    md += `Last Modified: ${entry.lastModified}\n\n`;
    md += `${entry.content}\n\n---\n\n`;
  }

  md += "## Skills\n\n";
  if (data.media?.skills) {
    for (const skill of data.media.skills) {
      md += `- **${skill.name}** (${skill.category}): ${skill.description}\n`;
    }
  }
  md += "\n";

  md += "## Gallery\n\n";
  for (const img of data.gallery) {
    md += `- ${img.prompt} (${img.createdAt})\n`;
  }
  md += "\n";

  return md;
}

export async function generateJSONExport(): Promise<string> {
  const data = await exportAllData();
  return JSON.stringify(data, null, 2);
}