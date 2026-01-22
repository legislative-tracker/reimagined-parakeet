import {
  db,
  getTypedCollection,
} from '@legislative-tracker/shared-config-firebase';
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
