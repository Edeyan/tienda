/**
 * Product text and name formatting utilities
 */

/**
 * Removes forbidden / unwanted keywords from product names:
 * 'motocicleta', 'motocicleca', 'scooter', 'electrico', 'eléctrico', 'electrica', 'eléctrica'
 */
export function cleanProductName(name: string | undefined): string {
  if (!name || typeof name !== 'string') return '';
  return name
    .replace(/\b(motocicletas?|motociclecas?|scooters?|el[ée]ctricos?|el[ée]ctricas?)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
