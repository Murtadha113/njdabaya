import { initializeApp, getApps, getApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const adminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
}

const isFreshApp = getApps().length === 0
export const adminApp = isFreshApp ? initializeApp({ credential: cert(adminConfig) }) : getApp()
export const adminDb = getFirestore(adminApp)
if (isFreshApp) {
  adminDb.settings({ ignoreUndefinedProperties: true })
}
