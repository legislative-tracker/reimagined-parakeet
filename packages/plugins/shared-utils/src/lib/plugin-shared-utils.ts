export const isImage = (imgStr: string): boolean => {
  if (!imgStr) return false;
  const str = imgStr.trim();
  if (!str) return false;
  if (str.includes('no_photo')) return false;
  return true;
};

export const isEmail = (emailStr: string): boolean => {
  if (!emailStr) return false;
  const str = emailStr.trim();
  if (!str) return false;
  if (!str.includes('@')) return false;
  return true;
};
