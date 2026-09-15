export const PRIMARY_ADMIN_UID = '6FCDYAhL3IW1K4ZuvLOLBjullv83';
export const PRIMARY_ADMIN_EMAIL = 'exporte2000@gmail.com';

export const isPrimaryAdmin = (uid: string | null | undefined): boolean =>
  uid === PRIMARY_ADMIN_UID;
