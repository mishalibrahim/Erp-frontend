export interface Tenant {
  id: string;
  name: string;
  industry: string;
  /** ISO 2-letter country code */
  country: string;
}

export const DUMMY_TENANTS: Tenant[] = [
  { id: "t-001", name: "Aegis Corp", industry: "Manufacturing", country: "AE" },
  { id: "t-002", name: "NovaTech LLC", industry: "Technology", country: "US" },
  { id: "t-003", name: "BlueWave Trading", industry: "Retail", country: "GB" },
  { id: "t-004", name: "Pinnacle Finance", industry: "Finance", country: "SG" },
  { id: "t-005", name: "GreenHarvest Co.", industry: "Agriculture", country: "IN" },
];
