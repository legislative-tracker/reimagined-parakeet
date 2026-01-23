import {
  db,
  getTypedCollection,
} from '@legislative-tracker/shared-config-firebase/admin';
import type {
  Legislation,
  Legislator,
  Legislature,
} from '@legislative-tracker/shared-data-models';

/**
 * Returns a Typed Collection of Legislature docs
 * @returns A Promise of an array of Legislatures or `undefined`
 */
export const getFirestoreLegislatures = async (): Promise<
  Legislature[] | undefined
> => {
  const colRef = getTypedCollection<Legislature>('legislatures');

  const snapshot = await colRef.get();
  return snapshot.empty ? undefined : snapshot.docs.map((doc) => doc.data());
};

/**
 * Returns a Typed Collection of Legislation docs for a particular Jurisdiction
 * @param { string } stateCd The state code of the docs to be retrieved (e.g., `US-NY`)
 * @returns A Promise of an array of Legislation or `undefined`
 */
export const getFirestoreLegislation = async (
  stateCd: string,
): Promise<Legislation[] | undefined> => {
  const path = `legislatures/${stateCd.toUpperCase()}/legislation`;
  const colRef = getTypedCollection<Legislation>(path);

  const snapshot = await colRef.get();
  return snapshot.empty ? undefined : snapshot.docs.map((doc) => doc.data());
};

/**
 * Returns a Typed Collection of Legislator docs for a particular Jurisdiction
 * @param { string } stateCd The state code of the docs to be retrieved (e.g., `US-NY`)
 * @returns A Promise of an array of Legislators or `undefined`
 */
export const getFirestoreLegislators = async (
  stateCd: string,
): Promise<Legislator[] | undefined> => {
  const path = `legislatures/${stateCd.toUpperCase()}/legislators`;
  const colRef = getTypedCollection<Legislator>(path);

  const snapshot = await colRef.get();
  return snapshot.empty ? undefined : snapshot.docs.map((doc) => doc.data());
};

/**
 * Updates the stored Legislator documents for a given state
 * @param { string } stateCd The state code of the docs to be updated (e.g., `US-NY`)
 * @param {Legislators[]} data An array of Legislation to write to Firestore
 */
export const updateFirestoreLegislators = async (
  stateCd: string,
  data: Legislator[],
) => {
  const bulkWriter = db.bulkWriter();
  const path = `legislatures/${stateCd.toUpperCase()}/legislators`;

  const colRef = db.collection(path);

  data.forEach((d: Legislator) => {
    const docRef = colRef.doc(d.id);
    bulkWriter.set(docRef, d, { merge: true });
  });

  await bulkWriter.close();
};

/**
 * Updates the stored Legislative documents for a given state
 * @param { string } stateCd The state code of the docs to be updated (e.g., `US-NY`)
 * @param {Legislation[]} data An array of Legislation to write to Firestore
 */
export const updateFirestoreLegislation = async (
  stateCd: string,
  data: Legislation[],
) => {
  const bulkWriter = db.bulkWriter();
  const path = `legislatures/${stateCd.toUpperCase()}/legislation`;

  const colRef = db.collection(path);

  data.forEach((d: Legislation) => {
    const docRef = colRef.doc(d.id);
    bulkWriter.set(docRef, d, { merge: true });
  });

  await bulkWriter.close();
};

/**
 * Pulls the Legislation collection of a particular state and updates Legislator docs with
 * the bills they're sponsoring
 * @param { string } stateCd The state code of the docs to be updated (e.g., `US-NY`)
 */
export const updateFirestoreSponsorships = async (stateCd: string) => {
  const bulkWriter = db.bulkWriter();
  const bills = await getFirestoreLegislation(stateCd);

  console.log(bills);

  if (!bills) throw new Error('No bills found for ' + stateCd);

  bills.forEach((bill: Legislation) => {
    /**
     * Some states use an empty string to signify the initial version of a bill
     * Firestore doesn't allow a map object's key to include nullish values, so
     * we need a placeholder for the value - hence "Original"
     */
    const ver = bill.current_version ? bill.current_version : 'Original';

    // Get the list of cosponsors for the latest version ONLY
    const sponsors = bill.cosponsorships[ver];

    // Make sure the Primary Sponsor is included in the sponsorships array
    if (bill.sponsorships && bill.sponsorships[0].id) {
      sponsors.push({
        id: bill.sponsorships[0].id,
        name: bill.sponsorships[0].name,
      });
    }

    sponsors.forEach((cosponsor) => {
      // We'll store the sponsorships as a subcollection of the Legislator
      // document for easier management with bulkWriter.set()
      const sponsorshipColRef = db.collection(
        `legislatures/${stateCd.toUpperCase()}/legislators/${cosponsor.id}/sponsorships`,
      );

      const docRef = sponsorshipColRef.doc(bill.id);

      bulkWriter.set(
        docRef,
        {
          id: bill.id,
          version: ver,
          title: bill.title,
        },
        // Merging ensures that we overwrite the version number if the
        // Legislator cosponsored a previous version of the bill
        { merge: true },
      );
    });
  });

  await bulkWriter.close();
};
