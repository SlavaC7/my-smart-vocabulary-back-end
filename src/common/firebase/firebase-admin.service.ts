import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
    const serviceAccount = require('../../../my-smart-vocabulary-firebase-adminsdk-fbsvc-19e792b43b.json');

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as string),
      });
    }
  }

  public auth(): admin.auth.Auth {
    return admin.auth();
  }
}
