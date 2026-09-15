// Flat delivery fee by region (GHS) - adjust once real courier rates are
// known. The frontend mirrors this list (src/data/regions.js) for the
// checkout dropdown and a live fee preview; this file is the authoritative
// source used when an order is actually created.
export const GHANA_REGIONS = [
  { name: 'Greater Accra', fee: 20 },
  { name: 'Ashanti', fee: 30 },
  { name: 'Central', fee: 30 },
  { name: 'Eastern', fee: 30 },
  { name: 'Western', fee: 30 },
  { name: 'Western North', fee: 40 },
  { name: 'Volta', fee: 35 },
  { name: 'Oti', fee: 45 },
  { name: 'Bono', fee: 40 },
  { name: 'Bono East', fee: 40 },
  { name: 'Ahafo', fee: 40 },
  { name: 'Northern', fee: 50 },
  { name: 'North East', fee: 50 },
  { name: 'Savannah', fee: 50 },
  { name: 'Upper East', fee: 55 },
  { name: 'Upper West', fee: 55 },
];

export function getDeliveryFee(region) {
  const match = GHANA_REGIONS.find((r) => r.name === region);
  return match ? match.fee : 40; // fallback if region somehow doesn't match
}