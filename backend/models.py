"""
UPEMP 2020 Incentive Calculator — Pydantic Models & Enums
All monetary values are in INR Crores unless specified otherwise.
"""

from __future__ import annotations
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field, model_validator


# ──────────────────────────── Enums ────────────────────────────

class Region(str, Enum):
    PASCHIMANCHAL = "PASCHIMANCHAL"
    MADHYANCHAL = "MADHYANCHAL"
    PURVANCHAL = "PURVANCHAL"
    BUNDELKHAND = "BUNDELKHAND"


class CSCategory(str, Enum):
    NONE = "NONE"
    FOCUS_AREA = "FOCUS_AREA"
    ANCHOR_UNIT = "ANCHOR_UNIT"


class FocusSector(str, Enum):
    DRONES = "DRONES"
    IOT = "IOT"
    DEFENSE_ELECTRONICS = "DEFENSE_ELECTRONICS"
    STRATEGIC_ELECTRONICS = "STRATEGIC_ELECTRONICS"
    ROBOTICS = "ROBOTICS"


class AnchorRange(str, Enum):
    ONE_TO_FIVE = "1_TO_5"
    SIX_TO_TEN = "6_TO_10"
    MORE_THAN_TEN = "MORE_THAN_10"


class StampDutyTxnType(str, Enum):
    INDIVIDUAL_PURCHASE = "INDIVIDUAL_PURCHASE"
    EMC_FIRST = "EMC_FIRST"
    EMC_SECOND = "EMC_SECOND"
    LEASE_10YR = "LEASE_10YR"


class ParkType(str, Enum):
    EMC = "EMC"
    PRIVATE_ESDM = "PRIVATE_ESDM"


# ──────────────────────────── Request ────────────────────────────

class CalculateRequest(BaseModel):
    """Full input payload for incentive calculation."""

    # ── Step 1: Capital Investment (Compulsory) ──
    land_cost: float = Field(0, ge=0, description="₹ Cr — excluded from FCI")
    building_cost: float = Field(0, ge=0, description="₹ Cr — capped at 10% of FCI")
    new_machinery: float = Field(..., gt=0, description="₹ Cr — 100% included in FCI")
    refurbished_machinery: float = Field(0, ge=0, description="₹ Cr — capped at 40% of FCI if GOI evaluated")
    is_goi_evaluated: bool = Field(False)
    is_rented_building: bool = Field(False)

    # ── Step 2: Workforce & Location (Compulsory) ──
    employment_count: int = Field(0, ge=0)
    region: Region = Field(...)

    # ── Step 3: Additional CS Category (Compulsory) ──
    cs_category: CSCategory = Field(CSCategory.NONE)
    focus_sector: Optional[FocusSector] = None
    anchor_range: Optional[AnchorRange] = None

    # ── Step 4: Optional Incentive Toggles ──
    # Interest Subsidy (§5.2)
    interest_subsidy_enabled: bool = False
    interest_subsidy_loan_100_fci: bool = False
    loan_amount: Optional[float] = Field(None, ge=0, description="₹ Cr")
    interest_rate: Optional[float] = Field(None, gt=0, description="% p.a.")

    # Stamp Duty (§5.3)
    stamp_duty_enabled: bool = False
    stamp_duty_txn_type: Optional[StampDutyTxnType] = None
    stamp_duty_amount: Optional[float] = Field(None, ge=0, description="₹ Lakhs")

    # Patent (§5.4)
    patent_enabled: bool = False
    domestic_patent_cost: Optional[float] = Field(None, ge=0, description="₹ Lakhs")
    international_patent_cost: Optional[float] = Field(None, ge=0, description="₹ Lakhs")

    # Land Subsidy (§5.5)
    land_subsidy_enabled: bool = False
    land_purchase_cost: Optional[float] = Field(None, ge=0, description="₹ Cr — from State Agency")
    total_project_cost: Optional[float] = Field(None, ge=0, description="₹ Cr")

    # Electricity Duty (§5.6)
    electricity_duty_enabled: bool = False
    annual_electricity_duty: Optional[float] = Field(None, ge=0, description="₹ Lakhs/year")

    # EPF Reimbursement (§5.11)
    epf_enabled: bool = False
    eligible_epf_employees: Optional[int] = Field(None, ge=0)

    # Lease Rentals (§5.12)
    lease_rental_enabled: bool = False
    annual_lease_rental: Optional[float] = Field(None, ge=0, description="₹ Lakhs/year")

    # Logistics Subsidy (§5.13)
    logistics_enabled: bool = False
    transport_cost: Optional[float] = Field(None, ge=0, description="₹ Cr")

    # Semiconductor (§5.10)
    semiconductor_enabled: bool = False
    goi_approved_cs: Optional[float] = Field(None, ge=0, description="₹ Cr")
    semiconductor_land_acres: Optional[float] = Field(None, ge=0, description="acres")
    etp_cost: Optional[float] = Field(None, ge=0, description="₹ Cr")

    # EMC / Private ESDM Park (§5.8, §5.9)
    park_enabled: bool = False
    park_type: Optional[ParkType] = None
    park_annual_interest: Optional[float] = Field(None, ge=0, description="₹ Cr/year")

    # ── Validators ──
    @model_validator(mode="after")
    def validate_mutual_exclusion(self):
        if self.cs_category == CSCategory.FOCUS_AREA and self.focus_sector is None:
            raise ValueError("focus_sector is required when cs_category is FOCUS_AREA")
        if self.cs_category == CSCategory.ANCHOR_UNIT and self.anchor_range is None:
            raise ValueError("anchor_range is required when cs_category is ANCHOR_UNIT")
        return self


# ──────────────────────────── Response ────────────────────────────

class FCIResult(BaseModel):
    calculated_fci: float
    building_included: float
    refurbished_included: float
    building_capped: bool
    refurbished_capped: bool
    case_used: int
    calculation_steps: List[str]


class IncentiveResult(BaseModel):
    name: str
    policy_section: str
    eligible: bool
    amount: float = 0  # ₹ Cr
    cap_applied: bool = False
    reason: str = ""
    calculation_steps: List[str] = []
    duration_years: Optional[int] = None
    annual_amount: Optional[float] = None
    disclaimers: List[str] = []


class DisbursementSchedule(BaseModel):
    component: str
    years: int
    annual_amount: float
    total: float
    notes: str = ""


class CalculateResponse(BaseModel):
    fci_result: FCIResult
    incentives: List[IncentiveResult]
    disbursement_schedule: List[DisbursementSchedule]
    grand_total: float
    fci_cap_applied: bool
    final_total: float
    total_as_pct_of_fci: float
    eligible_count: int
    ineligible_count: int
    disclaimers: List[str]
