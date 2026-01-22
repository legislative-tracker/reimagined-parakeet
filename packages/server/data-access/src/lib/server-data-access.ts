import { getTypedCollection } from '@legislative-tracker/shared-config-firebase';
import type {
  Legislation,
  Legislator,
  Legislature,
} from '@legislative-tracker/shared-data-models';

export const getFirestoreLegislatures = async (): Promise<
  Legislature[] | undefined
> => {
  const colRef = getTypedCollection<Legislature>('legislatures');

  const snapshot = await colRef.get();
  return snapshot.empty ? undefined : snapshot.docs.map((doc) => doc.data());
};

export const getFirestoreLegislation = async (
  stateCd: string,
): Promise<Legislation[] | undefined> => {
  const path = `legislatures/${stateCd.toUpperCase()}/legislation`;
  const colRef = getTypedCollection<Legislation>(path);

  const snapshot = await colRef.get();
  return snapshot.empty ? undefined : snapshot.docs.map((doc) => doc.data());
};

export const getFirestoreLegislators = async (
  stateCd: string,
): Promise<Legislator[] | undefined> => {
  const path = `legislatures/${stateCd.toUpperCase()}/legislators`;
  const colRef = getTypedCollection<Legislator>(path);

  const snapshot = await colRef.get();
  return snapshot.empty ? undefined : snapshot.docs.map((doc) => doc.data());
};
