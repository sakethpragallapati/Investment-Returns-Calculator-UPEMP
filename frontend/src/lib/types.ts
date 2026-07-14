/* ── Types matching the FastAPI backend models ── */

export type Region = "PASCHIMANCHAL" | "MADHYANCHAL" | "PURVANCHAL" | "BUNDELKHAND";
export type CSCategory = "NONE" | "FOCUS_AREA" | "ANCHOR_UNIT";
export type FocusSector = "DRONES" | "IOT" | "DEFENSE_ELECTRONICS" | "STRATEGIC_ELECTRONICS" | "ROBOTICS";
export type AnchorRange = "1_TO_5" | "6_TO_10" | "MORE_THAN_10";
export type StampDutyTxnType = "INDIVIDUAL_PURCHASE" | "EMC_FIRST" | "EMC_SECOND" | "LEASE_10YR";
export type ParkType = "EMC" | "PRIVATE_ESDM";

export interface CalculateRequest {
  // Step 1
  land_cost: number;
  building_cost: number;
  new_machinery: number;
  refurbished_machinery: number;
  is_goi_evaluated: boolean;
  is_rented_building: boolean;
  // Step 2
  employment_count: number;
  region: Region;
  // Step 3
  cs_category: CSCategory;
  focus_sector?: FocusSector;
  anchor_range?: AnchorRange;
  // Step 4 optional
  interest_subsidy_enabled: boolean;
  interest_subsidy_loan_100_fci: boolean;
  loan_amount?: number;
  interest_rate?: number;
  stamp_duty_enabled: boolean;
  stamp_duty_txn_type?: StampDutyTxnType;
  stamp_duty_amount?: number;
  patent_enabled: boolean;
  domestic_patent_cost?: number;
  international_patent_cost?: number;
  land_subsidy_enabled: boolean;
  land_purchase_cost?: number;
  total_project_cost?: number;
  electricity_duty_enabled: boolean;
  annual_electricity_duty?: number;
  epf_enabled: boolean;
  eligible_epf_employees?: number;
  lease_rental_enabled: boolean;
  annual_lease_rental?: number;
  logistics_enabled: boolean;
  transport_cost?: number;
  semiconductor_enabled: boolean;
  goi_approved_cs?: number;
  semiconductor_land_acres?: number;
  etp_cost?: number;
  park_enabled: boolean;
  park_type?: ParkType;
  park_annual_interest?: number;
}

export interface FCIResult {
  calculated_fci: number;
  building_included: number;
  refurbished_included: number;
  building_capped: boolean;
  refurbished_capped: boolean;
  case_used: number;
  calculation_steps: string[];
}

export interface IncentiveResult {
  name: string;
  policy_section: string;
  eligible: boolean;
  amount: number;
  cap_applied: boolean;
  reason: string;
  calculation_steps: string[];
  duration_years?: number;
  annual_amount?: number;
  disclaimers: string[];
}

export interface DisbursementSchedule {
  component: string;
  years: number;
  annual_amount: number;
  total: number;
  notes: string;
}

export interface CalculateResponse {
  fci_result: FCIResult;
  incentives: IncentiveResult[];
  disbursement_schedule: DisbursementSchedule[];
  grand_total: number;
  fci_cap_applied: boolean;
  final_total: number;
  total_as_pct_of_fci: number;
  eligible_count: number;
  ineligible_count: number;
  disclaimers: string[];
}

export const INITIAL_FORM_DATA: CalculateRequest = {
  land_cost: 0,
  building_cost: 0,
  new_machinery: 0,
  refurbished_machinery: 0,
  is_goi_evaluated: false,
  is_rented_building: false,
  employment_count: 0,
  region: "MADHYANCHAL",
  cs_category: "NONE",
  interest_subsidy_enabled: false,
  interest_subsidy_loan_100_fci: false,
  stamp_duty_enabled: false,
  patent_enabled: false,
  land_subsidy_enabled: false,
  electricity_duty_enabled: false,
  epf_enabled: false,
  lease_rental_enabled: false,
  logistics_enabled: false,
  semiconductor_enabled: false,
  park_enabled: false,
};

export const REGION_LABELS: Record<Region, string> = {
  PASCHIMANCHAL: "Paschimanchal (Western UP)",
  MADHYANCHAL: "Madhyanchal (Central UP)",
  PURVANCHAL: "Purvanchal (Eastern UP)",
  BUNDELKHAND: "Bundelkhand",
};

export const FOCUS_SECTOR_LABELS: Record<FocusSector, string> = {
  DRONES: "Drones & Components",
  IOT: "IoT",
  DEFENSE_ELECTRONICS: "Defense Electronics",
  STRATEGIC_ELECTRONICS: "Strategic Electronics",
  ROBOTICS: "Robotics",
};

export const ANCHOR_RANGE_LABELS: Record<AnchorRange, string> = {
  "1_TO_5": "1 to 5 ancillary units",
  "6_TO_10": "6 to 10 ancillary units",
  "MORE_THAN_10": "More than 10 ancillary units",
};

export const STAMP_DUTY_TXN_LABELS: Record<StampDutyTxnType, string> = {
  INDIVIDUAL_PURCHASE: "Individual ESDM Unit — Purchase/Lease (100% Exemption)",
  EMC_FIRST: "EMC/ESDM Park — First Transaction (100% Exemption)",
  EMC_SECOND: "EMC/ESDM Park — Second Transaction (50% Exemption)",
  LEASE_10YR: "Lease/Rent for ≥ 10 Years (50% Reimbursement)",
};
