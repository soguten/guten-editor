const DATABASE_NAME = "guten-local-content";
const DATABASE_VERSION = 1;
const NOTES_STORE_NAME = "notes";

export interface LocalNoteRecord {
    id: string;
    title: string;
    titleHtml: string;
    contentHtml: string;
    createdAt: number;
    updatedAt: number;
}

function hasIndexedDbSupport(): boolean {
    return typeof indexedDB !== "undefined";
}

function generateNoteId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function openDatabase(): Promise<IDBDatabase> {
    if (!hasIndexedDbSupport()) {
        return Promise.reject(new Error("IndexedDB is not available."));
    }

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

        request.onupgradeneeded = () => {
            const database = request.result;
            if (!database.objectStoreNames.contains(NOTES_STORE_NAME)) {
                const store = database.createObjectStore(NOTES_STORE_NAME, { keyPath: "id" });
                store.createIndex("updatedAt", "updatedAt", { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("Unable to open IndexedDB."));
    });
}

function runTransaction<T>(
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
    return openDatabase().then((database) => new Promise((resolve, reject) => {
        const transaction = database.transaction(NOTES_STORE_NAME, mode);
        const store = transaction.objectStore(NOTES_STORE_NAME);
        const request = operation(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("IndexedDB operation failed."));

        transaction.oncomplete = () => database.close();
        transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed."));
        transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted."));
    }));
}

export async function listLocalNotes(): Promise<LocalNoteRecord[]> {
  const records = await runTransaction<LocalNoteRecord[]>(
    "readonly",
    (store) => store.getAll() as IDBRequest<LocalNoteRecord[]>,
  );

  return records.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getLocalNoteById(id: string): Promise<LocalNoteRecord | undefined> {
    return runTransaction<LocalNoteRecord | undefined>("readonly", (store) => store.get(id));
}

export async function saveLocalNote(note: { id?: string; title: string; titleHtml: string; contentHtml: string }): Promise<LocalNoteRecord> {
    const timestamp = Date.now();
    const existing = note.id ? await getLocalNoteById(note.id) : undefined;

    const record: LocalNoteRecord = {
        id: existing?.id ?? note.id ?? generateNoteId(),
        title: note.title,
        titleHtml: note.titleHtml,
        contentHtml: note.contentHtml,
        createdAt: existing?.createdAt ?? timestamp,
        updatedAt: timestamp,
    };

    await runTransaction("readwrite", (store) => store.put(record));
    return record;
}