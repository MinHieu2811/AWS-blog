export const checkIsClient = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return true;
};