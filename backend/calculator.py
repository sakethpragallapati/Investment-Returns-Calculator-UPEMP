"""
UPEMP 2020 Incentive Calculator — Core Calculation Engine
All monetary values are in INR Crores (₹ Cr) unless noted otherwise.
Lakhs values are internally converted to Crores where needed.
"""

from __future__ import annotations
from models import (
    CalculateRequest, CalculateResponse,
    FCIResult, IncentiveResult, DisbursementSchedule,
    Region, CSCategory, FocusSector, AnchorRange,
    StampDutyTxnType, ParkType,
)


LAKHS_TO_CR = 1 / 100  # 1 Lakh = 0.01 Cr


def _fmt(val: float) -> str:
    """Format a number to 2 decimal places."""
    return f"{val:,.2f}"


# ═══════════════════════════════════════════════════════════════
# STEP 1: FIXED CAPITAL INVESTMENT (FCI)
# ═══════════════════════════════════════════════════════════════

def calculate_fci(req: CalculateRequest) -> FCIResult:
    P = req.new_machinery
    B = req.building_cost
    R = req.refurbished_machinery if req.is_goi_evaluated else 0.0

    steps: list[str] = []
    steps.append(f"New Machinery = ₹{_fmt(P)} Cr")
    steps.append(f"Building Cost = ₹{_fmt(B)} Cr")
    if req.is_goi_evaluated:
        steps.append(f"Refurbished Machinery = ₹{_fmt(R)} Cr (GOI Evaluated ✓)")
    else:
        steps.append(f"Refurbished Machinery = ₹0.00 Cr (GOI Not Evaluated — excluded)")

    # Case 1: Neither capped
    prov = P + B + R
    if prov > 0 and B <= 0.10 * prov and R <= 0.40 * prov:
        steps.append(f"Provisional FCI = New + Building + Refurbished = ₹{_fmt(prov)} Cr")
        steps.append(f"  Check Building ≤ 10% of FCI: {_fmt(B)} ≤ {_fmt(0.10 * prov)} ✓")
        steps.append(f"  Check Refurbished ≤ 40% of FCI: {_fmt(R)} ≤ {_fmt(0.40 * prov)} ✓")
        steps.append("  → Case 1 VALID: Neither component is capped.")
        return FCIResult(
            calculated_fci=round(prov, 2),
            building_included=round(B, 2),
            refurbished_included=round(R, 2),
            building_capped=False,
            refurbished_capped=False,
            case_used=1,
            calculation_steps=steps,
        )

    # Case 2: Only Building exceeds
    if (P + R) > 0:
        fci2 = (P + R) / 0.90
        b_inc2 = 0.10 * fci2
        if B > b_inc2 and R <= 0.40 * fci2:
            steps.append(f"Case 1 invalid (Building Cost={_fmt(B)} > 10% of Provisional FCI={_fmt(0.10 * prov)})")
            steps.append(f"FCI (solving for B cap) = (New + Refurbished) / 0.90 = ({_fmt(P)} + {_fmt(R)}) / 0.90 = ₹{_fmt(fci2)} Cr")
            steps.append(f"  Eligible Building = 10% × {_fmt(fci2)} = ₹{_fmt(b_inc2)} Cr (capped from ₹{_fmt(B)} Cr)")
            steps.append(f"  Check Refurbished ≤ 40% of FCI: {_fmt(R)} ≤ {_fmt(0.40 * fci2)} ✓")
            steps.append("  → Case 2 VALID: Building capped at 10% of FCI.")
            return FCIResult(
                calculated_fci=round(fci2, 2),
                building_included=round(b_inc2, 2),
                refurbished_included=round(R, 2),
                building_capped=True,
                refurbished_capped=False,
                case_used=2,
                calculation_steps=steps,
            )

    # Case 3: Only Refurbished exceeds
    if (P + B) > 0:
        fci3 = (P + B) / 0.60
        r_inc3 = 0.40 * fci3
        if R > r_inc3 and B <= 0.10 * fci3:
            steps.append(f"FCI (solving for R cap) = (New + Building) / 0.60 = ({_fmt(P)} + {_fmt(B)}) / 0.60 = ₹{_fmt(fci3)} Cr")
            steps.append(f"  Eligible Refurbished = 40% × {_fmt(fci3)} = ₹{_fmt(r_inc3)} Cr (capped from ₹{_fmt(R)} Cr)")
            steps.append(f"  Check Building ≤ 10% of FCI: {_fmt(B)} ≤ {_fmt(0.10 * fci3)} ✓")
            steps.append("  → Case 3 VALID: Refurbished capped at 40% of FCI.")
            return FCIResult(
                calculated_fci=round(fci3, 2),
                building_included=round(B, 2),
                refurbished_included=round(r_inc3, 2),
                building_capped=False,
                refurbished_capped=True,
                case_used=3,
                calculation_steps=steps,
            )

    # Case 4: Both exceed
    if P > 0:
        fci4 = P / 0.50
        b_inc4 = 0.10 * fci4
        r_inc4 = 0.40 * fci4
        steps.append(f"FCI (solving for B and R cap) = New Machinery / 0.50 = {_fmt(P)} / 0.50 = ₹{_fmt(fci4)} Cr")
        steps.append(f"  Eligible Building = 10% × {_fmt(fci4)} = ₹{_fmt(b_inc4)} Cr (capped from ₹{_fmt(B)} Cr)")
        steps.append(f"  Eligible Refurbished = 40% × {_fmt(fci4)} = ₹{_fmt(r_inc4)} Cr (capped from ₹{_fmt(R)} Cr)")
        steps.append("  → Case 4 VALID: Both Building and Refurbished are capped.")
        return FCIResult(
            calculated_fci=round(fci4, 2),
            building_included=round(b_inc4, 2),
            refurbished_included=round(r_inc4, 2),
            building_capped=True,
            refurbished_capped=True,
            case_used=4,
            calculation_steps=steps,
        )

    # Fallback (should not happen with valid inputs)
    steps.append("FCI = New Machinery only")
    return FCIResult(
        calculated_fci=round(P, 2),
        building_included=0,
        refurbished_included=0,
        building_capped=False,
        refurbished_capped=False,
        case_used=0,
        calculation_steps=steps,
    )


# ═══════════════════════════════════════════════════════════════
# INCENTIVE CALCULATORS
# ═══════════════════════════════════════════════════════════════

def calc_capital_subsidy(fci: float, employment: int, is_rented: bool) -> tuple[IncentiveResult, list[DisbursementSchedule]]:
    steps = []
    disclaimers = []

    # Base subsidy
    base = fci * 0.15
    steps.append(f"Base Subsidy = FCI × 15% = {_fmt(fci)} × 0.15 = ₹{_fmt(base)} Cr")

    # Mega bonus
    mega = 0.0
    if fci >= 1000 and employment >= 3000:
        mega = min((fci - 1000) * 0.10, 100)
        steps.append(f"Mega Project Bonus: FCI ≥ ₹1000 Cr ✓ AND Employees ≥ 3000 ✓")
        steps.append(f"  Mega = min((FCI − 1000) × 10%, 100) = min(({_fmt(fci)} − 1000) × 0.10, 100) = ₹{_fmt(mega)} Cr")
    else:
        reasons = []
        if fci < 1000:
            reasons.append(f"FCI ({_fmt(fci)} Cr) < ₹1000 Cr")
        if employment < 3000:
            reasons.append(f"Employees ({employment}) < 3000")
        steps.append(f"Mega Project Bonus: Not eligible — {', '.join(reasons)}")

    # Core cap
    uncapped = base + mega
    core = min(uncapped, 250)
    if uncapped > 250:
        steps.append(f"Core Subsidy (uncapped) = {_fmt(base)} + {_fmt(mega)} = ₹{_fmt(uncapped)} Cr")
        steps.append(f"Core Subsidy (capped) = min({_fmt(uncapped)}, 250) = ₹{_fmt(core)} Cr ← Policy cap of ₹250 Cr applied")
    else:
        steps.append(f"Core Subsidy = {_fmt(base)} + {_fmt(mega)} = ₹{_fmt(core)} Cr (under ₹250 Cr cap)")

    # Disbursement
    disb_schedules = []
    if is_rented:
        years = 5
        steps.append("Disbursement: 5 years (Rented/Plug & Play building override)")
        disclaimers.append("Capital Subsidy for units in Plug & Play / Rented buildings is paid in 5 yearly installments.")
    elif fci <= 200:
        years = 1
        steps.append("Disbursement: Lump sum (FCI ≤ ₹200 Cr → Tier 1)")
    elif fci < 1000:
        years = 3
        steps.append(f"Disbursement: 3 yearly installments (₹200 Cr < FCI < ₹1000 Cr → Tier 2)")
    else:
        years = 5
        steps.append("Disbursement: 5 yearly installments (FCI ≥ ₹1000 Cr → Tier 3)")
        disclaimers.append("First installment released from the year the unit achieves commercial production at minimum 80% capacity.")

    annual = core / years if years > 0 else core
    steps.append(f"Annual Payout = ₹{_fmt(core)} / {years} = ₹{_fmt(annual)} Cr/year")

    disb_schedules.append(DisbursementSchedule(
        component="Capital Subsidy (Core)",
        years=years,
        annual_amount=round(annual, 2),
        total=round(core, 2),
        notes="Payable after commencement of commercial production"
    ))

    return IncentiveResult(
        name="Capital Subsidy",
        policy_section="§5.1",
        eligible=True,
        amount=round(core, 2),
        cap_applied=uncapped > 250,
        reason="All ESDM units investing in UP are eligible for Capital Subsidy at 15% of FCI.",
        calculation_steps=steps,
        duration_years=years,
        annual_amount=round(annual, 2),
        disclaimers=disclaimers,
    ), disb_schedules


def calc_anchor_bonus(fci: float, req: CalculateRequest) -> IncentiveResult:
    if req.cs_category != CSCategory.ANCHOR_UNIT or req.anchor_range is None:
        return IncentiveResult(
            name="Additional CS — Anchor Unit",
            policy_section="§5.1(a)",
            eligible=False,
            reason="Not selected or Focus Area was chosen instead (mutually exclusive).",
            calculation_steps=["Anchor Unit bonus not applicable — user did not select Anchor Unit category."],
        )

    rate_map = {
        AnchorRange.ONE_TO_FIVE: (0.015, "1.5%", "1 to 5 ancillary units"),
        AnchorRange.SIX_TO_TEN: (0.025, "2.5%", "6 to 10 ancillary units"),
        AnchorRange.MORE_THAN_TEN: (0.05, "5%", "More than 10 ancillary units"),
    }
    rate, rate_str, desc = rate_map[req.anchor_range]
    bonus = fci * rate
    steps = [
        f"Anchor Unit category: {desc}",
        f"Anchor Bonus = FCI × {rate_str} = {_fmt(fci)} × {rate} = ₹{_fmt(bonus)} Cr",
    ]
    return IncentiveResult(
        name="Additional CS — Anchor Unit",
        policy_section="§5.1(a)",
        eligible=True,
        amount=round(bonus, 2),
        reason=f"Eligible as Anchor Unit with {desc}.",
        calculation_steps=steps,
        disclaimers=[
            "Incentive paid AFTER successful establishment of all proposed ancillary units.",
            "Anchor unit must procure min. 40% of raw material from proposed ancillary units.",
        ],
    )


def calc_focus_area_bonus(fci: float, req: CalculateRequest) -> IncentiveResult:
    if req.cs_category != CSCategory.FOCUS_AREA or req.focus_sector is None:
        return IncentiveResult(
            name="Additional CS — Focus Area",
            policy_section="§5.1(b)",
            eligible=False,
            reason="Not selected or Anchor Unit was chosen instead (mutually exclusive).",
            calculation_steps=["Focus Area bonus not applicable — user did not select Focus Area category."],
        )

    sector_labels = {
        FocusSector.DRONES: "Drones & Components",
        FocusSector.IOT: "IoT",
        FocusSector.DEFENSE_ELECTRONICS: "Defense Electronics",
        FocusSector.STRATEGIC_ELECTRONICS: "Strategic Electronics",
        FocusSector.ROBOTICS: "Robotics",
    }
    label = sector_labels.get(req.focus_sector, req.focus_sector.value)
    bonus = fci * 0.05
    steps = [
        f"Focus Sector: {label}",
        f"Focus Area Bonus = FCI × 5% = {_fmt(fci)} × 0.05 = ₹{_fmt(bonus)} Cr",
    ]
    return IncentiveResult(
        name="Additional CS — Focus Area",
        policy_section="§5.1(b)",
        eligible=True,
        amount=round(bonus, 2),
        reason=f"Eligible for 5% additional CS as a {label} unit.",
        calculation_steps=steps,
    )


def calc_interest_subsidy(fci: float, req: CalculateRequest) -> tuple[IncentiveResult, list[DisbursementSchedule]]:
    disb: list[DisbursementSchedule] = []

    if not req.interest_subsidy_enabled:
        return IncentiveResult(
            name="Interest Subsidy",
            policy_section="§5.2",
            eligible=False,
            reason="Interest subsidy section was not enabled by the user.",
            calculation_steps=["User did not indicate a loan from a Scheduled Bank."],
        ), disb

    if fci > 200:
        return IncentiveResult(
            name="Interest Subsidy",
            policy_section="§5.2",
            eligible=False,
            reason=f"FCI (₹{_fmt(fci)} Cr) exceeds ₹200 Cr limit for Interest Subsidy eligibility.",
            calculation_steps=[f"Eligibility check: FCI = ₹{_fmt(fci)} Cr > ₹200 Cr → NOT ELIGIBLE"],
        ), disb

    if req.interest_subsidy_loan_100_fci:
        loan = fci
    else:
        loan = req.loan_amount or 0

    rate = req.interest_rate or 0
    if loan <= 0 or rate <= 0:
        return IncentiveResult(
            name="Interest Subsidy",
            policy_section="§5.2",
            eligible=False,
            reason="Loan amount or interest rate not provided.",
            calculation_steps=["Missing loan details."],
        ), disb

    annual_interest = loan * (rate / 100)
    subsidy_rate = min(5.0, rate)  # reimburse up to 5 percentage points
    annual_subsidy = loan * (subsidy_rate / 100)
    annual_subsidy = min(annual_subsidy, 1.0)  # cap ₹1 Cr/year
    total = annual_subsidy * 7
    total = min(total, 7.0)  # cap ₹7 Cr total

    steps = [
        f"Eligibility: FCI = ₹{_fmt(fci)} Cr ≤ ₹200 Cr ✓",
        f"Loan Amount = ₹{_fmt(loan)} Cr at {rate}% p.a.",
        f"Annual Interest = ₹{_fmt(loan)} × {rate}% = ₹{_fmt(annual_interest)} Cr",
        f"Subsidy Rate = min(5%, {rate}%) = {subsidy_rate}%",
        f"Annual Subsidy = ₹{_fmt(loan)} × {subsidy_rate}% = ₹{_fmt(loan * (subsidy_rate / 100))} Cr",
        f"Annual Subsidy (capped) = min(₹{_fmt(loan * (subsidy_rate / 100))}, ₹1.00) = ₹{_fmt(annual_subsidy)} Cr/year",
        f"Total over 7 years = ₹{_fmt(annual_subsidy)} × 7 = ₹{_fmt(total)} Cr",
    ]

    disb.append(DisbursementSchedule(
        component="Interest Subsidy",
        years=7,
        annual_amount=round(annual_subsidy, 2),
        total=round(total, 2),
        notes="Reimbursement on loan from Scheduled Banks/FIs",
    ))

    return IncentiveResult(
        name="Interest Subsidy",
        policy_section="§5.2",
        eligible=True,
        amount=round(total, 2),
        cap_applied=annual_subsidy < loan * (subsidy_rate / 100),
        reason="Eligible for 5% p.a. interest subsidy on loan for up to 7 years.",
        calculation_steps=steps,
        duration_years=7,
        annual_amount=round(annual_subsidy, 2),
    ), disb


def calc_stamp_duty(req: CalculateRequest) -> IncentiveResult:
    if not req.stamp_duty_enabled:
        return IncentiveResult(
            name="Stamp Duty Exemption",
            policy_section="§5.3",
            eligible=False,
            reason="Stamp Duty exemption not enabled by the user.",
            calculation_steps=["User indicated no land purchase/lease transaction."],
        )

    txn = req.stamp_duty_txn_type
    amount_lakhs = req.stamp_duty_amount or 0
    if txn is None or amount_lakhs <= 0:
        return IncentiveResult(
            name="Stamp Duty Exemption",
            policy_section="§5.3",
            eligible=False,
            reason="Transaction type or stamp duty amount not provided.",
            calculation_steps=["Incomplete stamp duty inputs."],
        )

    rate_map = {
        StampDutyTxnType.INDIVIDUAL_PURCHASE: (1.0, "100%", "Individual ESDM unit — purchase/lease"),
        StampDutyTxnType.EMC_FIRST: (1.0, "100%", "EMC/ESDM park — first transaction (Owner to Developer)"),
        StampDutyTxnType.EMC_SECOND: (0.5, "50%", "EMC/ESDM park — second transaction (Developer to Unit)"),
        StampDutyTxnType.LEASE_10YR: (0.5, "50%", "Lease/rent for minimum 10 years"),
    }
    rate, rate_str, desc = rate_map[txn]
    savings_lakhs = amount_lakhs * rate
    savings_cr = savings_lakhs * LAKHS_TO_CR

    steps = [
        f"Transaction Type: {desc}",
        f"Stamp Duty Amount = ₹{_fmt(amount_lakhs)} Lakhs",
        f"Exemption Rate = {rate_str}",
        f"Savings = ₹{_fmt(amount_lakhs)} × {rate_str} = ₹{_fmt(savings_lakhs)} Lakhs (₹{_fmt(savings_cr)} Cr)",
    ]

    return IncentiveResult(
        name="Stamp Duty Exemption",
        policy_section="§5.3",
        eligible=True,
        amount=round(savings_cr, 4),
        reason=f"{rate_str} stamp duty exemption for {desc}.",
        calculation_steps=steps,
        disclaimers=[
            "Stamp duty exemption given against Bank Guarantee, released upon commencement of commercial production."
        ],
    )


def calc_patent_reimbursement(req: CalculateRequest) -> IncentiveResult:
    if not req.patent_enabled:
        return IncentiveResult(
            name="Patent Cost Reimbursement",
            policy_section="§5.4",
            eligible=False,
            reason="Patent reimbursement not enabled by the user.",
            calculation_steps=["User indicated no patents filed."],
        )

    dom = req.domestic_patent_cost or 0
    intl = req.international_patent_cost or 0
    if dom <= 0 and intl <= 0:
        return IncentiveResult(
            name="Patent Cost Reimbursement",
            policy_section="§5.4",
            eligible=False,
            reason="No patent costs provided.",
            calculation_steps=["Both domestic and international patent costs are zero."],
        )

    dom_reimb = min(dom, 5.0)  # ₹5 Lakhs cap
    intl_reimb = min(intl, 10.0)  # ₹10 Lakhs cap
    total_lakhs = dom_reimb + intl_reimb
    total_cr = total_lakhs * LAKHS_TO_CR

    steps = []
    if dom > 0:
        steps.append(f"Domestic Patent: min(₹{_fmt(dom)} Lakhs, ₹5.00 Lakhs) = ₹{_fmt(dom_reimb)} Lakhs")
    if intl > 0:
        steps.append(f"International Patent: min(₹{_fmt(intl)} Lakhs, ₹10.00 Lakhs) = ₹{_fmt(intl_reimb)} Lakhs")
    steps.append(f"Total Reimbursement = ₹{_fmt(total_lakhs)} Lakhs (₹{_fmt(total_cr)} Cr)")

    return IncentiveResult(
        name="Patent Cost Reimbursement",
        policy_section="§5.4",
        eligible=True,
        amount=round(total_cr, 4),
        cap_applied=(dom > 5 or intl > 10),
        reason="Successful patents are eligible for cost reimbursement.",
        calculation_steps=steps,
    )


def calc_land_subsidy(req: CalculateRequest) -> IncentiveResult:
    if not req.land_subsidy_enabled:
        return IncentiveResult(
            name="Land Subsidy",
            policy_section="§5.5",
            eligible=False,
            reason="Land subsidy not enabled by the user.",
            calculation_steps=["User indicated no land purchase from a State Agency."],
        )

    land_cost = req.land_purchase_cost or 0
    project_cost = req.total_project_cost or 0
    if land_cost <= 0 or project_cost <= 0:
        return IncentiveResult(
            name="Land Subsidy",
            policy_section="§5.5",
            eligible=False,
            reason="Land purchase cost or total project cost not provided.",
            calculation_steps=["Incomplete land subsidy inputs."],
        )

    region = req.region
    if region in (Region.MADHYANCHAL, Region.PASCHIMANCHAL):
        rate = 0.25
        rate_str = "25%"
        region_desc = "Madhyanchal / Paschimanchal"
    else:
        rate = 0.50
        rate_str = "50%"
        region_desc = "Bundelkhand / Purvanchal"

    raw = land_cost * rate
    cap = min(project_cost * 0.075, 75.0)
    final = min(raw, cap)

    steps = [
        f"Region: {region.value} → {rate_str} subsidy ({region_desc})",
        f"Raw Subsidy = ₹{_fmt(land_cost)} × {rate_str} = ₹{_fmt(raw)} Cr",
        f"Cap = min(7.5% of Project Cost, ₹75 Cr) = min({_fmt(project_cost)} × 7.5%, 75) = ₹{_fmt(cap)} Cr",
        f"Final Land Subsidy = min(₹{_fmt(raw)}, ₹{_fmt(cap)}) = ₹{_fmt(final)} Cr",
    ]

    return IncentiveResult(
        name="Land Subsidy",
        policy_section="§5.5",
        eligible=True,
        amount=round(final, 2),
        cap_applied=raw > cap,
        reason=f"Eligible for {rate_str} land subsidy in {region_desc}.",
        calculation_steps=steps,
        disclaimers=["Subsidy paid by State Government post commercialization in proportion to land utilized."],
    )


def calc_electricity_duty(req: CalculateRequest) -> IncentiveResult:
    region = req.region
    rate_map = {
        Region.PASCHIMANCHAL: (0.50, "50%"),
        Region.MADHYANCHAL: (0.75, "75%"),
        Region.PURVANCHAL: (1.0, "100%"),
        Region.BUNDELKHAND: (1.0, "100%"),
    }
    rate, rate_str = rate_map[region]
    duration = 10

    if not req.electricity_duty_enabled or not req.annual_electricity_duty:
        steps = [
            f"Region: {region.value} → {rate_str} Electricity Duty Exemption for {duration} years",
            "Annual electricity duty amount not provided — showing qualitative benefit only.",
        ]
        return IncentiveResult(
            name="Electricity Duty Exemption",
            policy_section="§5.6",
            eligible=True,
            amount=0,
            reason=f"Eligible for {rate_str} electricity duty exemption in {region.value} for {duration} years.",
            calculation_steps=steps,
            duration_years=duration,
        )

    annual_duty_lakhs = req.annual_electricity_duty
    annual_savings_lakhs = annual_duty_lakhs * rate
    total_savings_lakhs = annual_savings_lakhs * duration
    total_cr = total_savings_lakhs * LAKHS_TO_CR

    steps = [
        f"Region: {region.value} → {rate_str} exemption",
        f"Annual Electricity Duty = ₹{_fmt(annual_duty_lakhs)} Lakhs",
        f"Annual Savings = ₹{_fmt(annual_duty_lakhs)} × {rate_str} = ₹{_fmt(annual_savings_lakhs)} Lakhs",
        f"Duration = {duration} years",
        f"Total Savings = ₹{_fmt(annual_savings_lakhs)} × {duration} = ₹{_fmt(total_savings_lakhs)} Lakhs (₹{_fmt(total_cr)} Cr)",
    ]

    return IncentiveResult(
        name="Electricity Duty Exemption",
        policy_section="§5.6",
        eligible=True,
        amount=round(total_cr, 4),
        reason=f"Eligible for {rate_str} electricity duty exemption in {region.value} for {duration} years.",
        calculation_steps=steps,
        duration_years=duration,
        annual_amount=round(annual_savings_lakhs * LAKHS_TO_CR, 4),
    )


def calc_skill_development() -> IncentiveResult:
    return IncentiveResult(
        name="Skill Development Assistance",
        policy_section="§5.7",
        eligible=True,
        amount=0,
        reason="All ESDM units are eligible for stipend reimbursement under Apprenticeship Scheme and 24×7 operations.",
        calculation_steps=[
            "Qualitative benefit — no direct monetary calculation.",
            "Eligible for reimbursement of stipend under Apprenticeship Assistance Scheme.",
            "Permission for 24×7 operations and employment of women in all three shifts.",
        ],
    )


def calc_epf_reimbursement(req: CalculateRequest) -> tuple[IncentiveResult, list[DisbursementSchedule]]:
    disb: list[DisbursementSchedule] = []

    if not req.epf_enabled or not req.eligible_epf_employees or req.eligible_epf_employees <= 0:
        return IncentiveResult(
            name="EPF Reimbursement",
            policy_section="§5.11",
            eligible=False,
            reason="EPF reimbursement not enabled or no eligible employees specified.",
            calculation_steps=["User did not indicate eligible employees (Women/SC/ST/Transgender/Divyangjan, UP domicile)."],
        ), disb

    emp = req.eligible_epf_employees
    monthly_per_emp = 2000  # ₹2000/month
    annual_per_emp = monthly_per_emp * 12  # ₹24,000/year
    annual_total = emp * annual_per_emp  # in ₹
    annual_cap = 1_00_00_000  # ₹1 Cr = 1,00,00,000
    annual_capped = min(annual_total, annual_cap)
    annual_cr = annual_capped / 1_00_00_000
    duration = 5
    total_cr = annual_cr * duration

    steps = [
        f"Eligible Employees = {emp} (Women/SC/ST/Transgender/Divyangjan, UP domicile)",
        f"Per Employee = ₹2,000/month × 12 = ₹24,000/year",
        f"Annual Total = {emp} × ₹24,000 = ₹{annual_total:,.0f}",
        f"Annual Cap = ₹1,00,00,000 (₹1 Cr)",
        f"Annual (capped) = min(₹{annual_total:,.0f}, ₹1,00,00,000) = ₹{annual_capped:,.0f} (₹{_fmt(annual_cr)} Cr)",
        f"Duration = {duration} years",
        f"Total EPF Reimbursement = ₹{_fmt(annual_cr)} × {duration} = ₹{_fmt(total_cr)} Cr",
    ]

    disb.append(DisbursementSchedule(
        component="EPF Reimbursement",
        years=duration,
        annual_amount=round(annual_cr, 4),
        total=round(total_cr, 4),
        notes="Only for Women/SC/ST/Transgender/Divyangjan employees of UP domicile with 1 year continuous employment",
    ))

    return IncentiveResult(
        name="EPF Reimbursement",
        policy_section="§5.11",
        eligible=True,
        amount=round(total_cr, 4),
        cap_applied=annual_total > annual_cap,
        reason="100% EPF reimbursement for eligible employees up to ₹2000/month per employee.",
        calculation_steps=steps,
        duration_years=duration,
        annual_amount=round(annual_cr, 4),
        disclaimers=[
            "Only for Women/SC/ST/Transgender/Divyangjan employees of UP domicile.",
            "Employee must have continuous 1-year employment after start of commercial operations.",
        ],
    ), disb


def calc_lease_rental(fci: float, req: CalculateRequest) -> tuple[IncentiveResult, list[DisbursementSchedule]]:
    disb: list[DisbursementSchedule] = []

    if not req.lease_rental_enabled:
        return IncentiveResult(
            name="Lease Rental Reimbursement",
            policy_section="§5.12",
            eligible=False,
            reason="Lease rental reimbursement not enabled by the user.",
            calculation_steps=["User did not indicate leasing an industrial shed/building."],
        ), disb

    if fci >= 200:
        return IncentiveResult(
            name="Lease Rental Reimbursement",
            policy_section="§5.12",
            eligible=False,
            reason=f"FCI (₹{_fmt(fci)} Cr) exceeds ₹200 Cr limit for Lease Rental eligibility.",
            calculation_steps=[f"Eligibility check: FCI = ₹{_fmt(fci)} Cr ≥ ₹200 Cr → NOT ELIGIBLE"],
        ), disb

    annual_lakhs = req.annual_lease_rental or 0
    if annual_lakhs <= 0:
        return IncentiveResult(
            name="Lease Rental Reimbursement",
            policy_section="§5.12",
            eligible=False,
            reason="Annual lease rental amount not provided.",
            calculation_steps=["Missing lease rental input."],
        ), disb

    reimb_lakhs = min(annual_lakhs * 0.25, 25.0)
    duration = 5
    total_lakhs = reimb_lakhs * duration
    total_cr = total_lakhs * LAKHS_TO_CR

    steps = [
        f"Eligibility: FCI = ₹{_fmt(fci)} Cr < ₹200 Cr ✓",
        f"Annual Lease Rental = ₹{_fmt(annual_lakhs)} Lakhs",
        f"Annual Reimbursement = min(₹{_fmt(annual_lakhs)} × 25%, ₹25 Lakhs) = ₹{_fmt(reimb_lakhs)} Lakhs",
        f"Duration = {duration} years",
        f"Total = ₹{_fmt(reimb_lakhs)} × {duration} = ₹{_fmt(total_lakhs)} Lakhs (₹{_fmt(total_cr)} Cr)",
    ]

    disb.append(DisbursementSchedule(
        component="Lease Rental Reimbursement",
        years=duration,
        annual_amount=round(reimb_lakhs * LAKHS_TO_CR, 4),
        total=round(total_cr, 4),
        notes="For industrial sheds/buildings taken on lease/rent",
    ))

    return IncentiveResult(
        name="Lease Rental Reimbursement",
        policy_section="§5.12",
        eligible=True,
        amount=round(total_cr, 4),
        cap_applied=annual_lakhs * 0.25 > 25,
        reason="25% reimbursement of lease rentals for units with FCI < ₹200 Cr.",
        calculation_steps=steps,
        duration_years=duration,
        annual_amount=round(reimb_lakhs * LAKHS_TO_CR, 4),
    ), disb


def calc_logistics_subsidy(req: CalculateRequest) -> IncentiveResult:
    if not req.logistics_enabled:
        return IncentiveResult(
            name="Logistics Subsidy",
            policy_section="§5.13",
            eligible=False,
            reason="Logistics subsidy not enabled — unit is not relocating from an international location.",
            calculation_steps=["User did not indicate relocation from international location."],
        )

    cost = req.transport_cost or 0
    if cost <= 0:
        return IncentiveResult(
            name="Logistics Subsidy",
            policy_section="§5.13",
            eligible=False,
            reason="Transportation cost not provided.",
            calculation_steps=["Missing transport cost input."],
        )

    reimb = min(cost * 0.50, 2.0)
    steps = [
        f"Transportation Cost = ₹{_fmt(cost)} Cr",
        f"Reimbursement = min(₹{_fmt(cost)} × 50%, ₹2.00 Cr) = ₹{_fmt(reimb)} Cr",
    ]

    return IncentiveResult(
        name="Logistics Subsidy",
        policy_section="§5.13",
        eligible=True,
        amount=round(reimb, 2),
        cap_applied=cost * 0.50 > 2,
        reason="50% reimbursement of transport cost for relocating from international location.",
        calculation_steps=steps,
    )


def calc_semiconductor(req: CalculateRequest) -> IncentiveResult:
    if not req.semiconductor_enabled:
        return IncentiveResult(
            name="Semiconductor Unit Benefits",
            policy_section="§5.10",
            eligible=False,
            reason="Semiconductor unit benefits not enabled.",
            calculation_steps=["User did not indicate a semiconductor/FAB/OSAT unit."],
        )

    steps = []
    total = 0.0
    disclaimers = []

    # Additional CS on GOI-approved
    goi_cs = req.goi_approved_cs or 0
    if goi_cs > 0:
        add_cs = goi_cs * 0.50
        steps.append(f"Additional Capital Subsidy = GOI CS × 50% = ₹{_fmt(goi_cs)} × 50% = ₹{_fmt(add_cs)} Cr")
        total += add_cs

    # Land rebate
    acres = req.semiconductor_land_acres or 0
    if acres > 0:
        first_200 = min(acres, 200)
        additional = max(acres - 200, 0)
        # We note this as a qualitative % since we don't have ₹/acre cost
        steps.append(f"Land: {_fmt(first_200)} acres at 75% subsidy" + (f", {_fmt(additional)} acres at 30% subsidy" if additional > 0 else ""))
        disclaimers.append("Land rebate calculated as percentage of prevailing sector rates from State Agencies.")

    # ETP
    etp = req.etp_cost or 0
    if etp > 0:
        etp_sub = min(etp * 0.50, 1.0)
        steps.append(f"ETP Subsidy = min(₹{_fmt(etp)} × 50%, ₹1.00 Cr) = ₹{_fmt(etp_sub)} Cr")
        total += etp_sub

    # Qualitative
    steps.append("Stamp Duty: 100% exemption on purchase/lease of land")
    steps.append("Electricity Duty: 100% exemption for 20 years")
    steps.append("Power Tariff: Industrial rates applicable")
    disclaimers.append("Further relaxation on case-to-case basis for FAB units subject to State Cabinet approval.")

    return IncentiveResult(
        name="Semiconductor Unit Benefits",
        policy_section="§5.10",
        eligible=True,
        amount=round(total, 2),
        reason="Eligible for enhanced incentives as a Semiconductor/FAB/OSAT unit.",
        calculation_steps=steps,
        disclaimers=disclaimers,
    )


def calc_emc_park(req: CalculateRequest) -> IncentiveResult:
    if not req.park_enabled or req.park_type is None:
        return IncentiveResult(
            name="EMC / Private ESDM Park",
            policy_section="§5.8 / §5.9",
            eligible=False,
            reason="EMC/ESDM Park incentives not enabled.",
            calculation_steps=["User did not indicate being a Developer/PIA for an EMC or ESDM Park."],
        )

    steps = []
    total = 0.0

    if req.park_type == ParkType.EMC:
        steps.append("Park Type: Electronics Manufacturing Cluster (EMC)")
        steps.append("GOI contributes 50% of EMC cost for infrastructure")
        steps.append("State Government contributes 25% of EMC cost")
        steps.append("PIA contributes remaining 25%")
        steps.append("For CFC: GOI 75%, PIA 25%")
        steps.append("Land subsidy available as per §5.5")
    else:
        steps.append("Park Type: Private ESDM Park")
        annual_interest = req.park_annual_interest or 0
        if annual_interest > 0:
            annual_reimb = min(annual_interest * 0.60, 10.0)
            total_reimb = min(annual_reimb * 7, 50.0)
            steps.append(f"Annual Interest Paid = ₹{_fmt(annual_interest)} Cr")
            steps.append(f"Annual Reimbursement = min(₹{_fmt(annual_interest)} × 60%, ₹10 Cr) = ₹{_fmt(annual_reimb)} Cr")
            steps.append(f"Total (7 years) = min(₹{_fmt(annual_reimb)} × 7, ₹50 Cr) = ₹{_fmt(total_reimb)} Cr")
            total = total_reimb
        steps.append("Stamp Duty: 100% on first transaction, 50% on second")
        steps.append("Land subsidy available as per §5.5")

    return IncentiveResult(
        name="EMC / Private ESDM Park",
        policy_section="§5.8 / §5.9",
        eligible=True,
        amount=round(total, 2),
        reason=f"Eligible for {req.park_type.value} park incentives.",
        calculation_steps=steps,
    )


# ═══════════════════════════════════════════════════════════════
# ORCHESTRATOR
# ═══════════════════════════════════════════════════════════════

def calculate_all(req: CalculateRequest) -> CalculateResponse:
    # Step 1: FCI
    fci_result = calculate_fci(req)
    fci = fci_result.calculated_fci

    # Step 2–6: Capital Subsidy
    cs_result, cs_disb = calc_capital_subsidy(fci, req.employment_count, req.is_rented_building)

    # Multiplier (mutually exclusive)
    anchor_result = calc_anchor_bonus(fci, req)
    focus_result = calc_focus_area_bonus(fci, req)

    # Determine multiplier bonus
    multiplier = 0.0
    if anchor_result.eligible:
        multiplier = anchor_result.amount
    elif focus_result.eligible:
        multiplier = focus_result.amount

    # Total Capital Subsidy (Core + Multiplier) capped at 100% FCI
    total_cs = cs_result.amount + multiplier
    total_cs = min(total_cs, fci)

    # Other incentives
    interest_result, interest_disb = calc_interest_subsidy(fci, req)
    stamp_result = calc_stamp_duty(req)
    patent_result = calc_patent_reimbursement(req)
    land_result = calc_land_subsidy(req)
    elec_result = calc_electricity_duty(req)
    skill_result = calc_skill_development()
    epf_result, epf_disb = calc_epf_reimbursement(req)
    lease_result, lease_disb = calc_lease_rental(fci, req)
    logistics_result = calc_logistics_subsidy(req)
    semi_result = calc_semiconductor(req)
    emc_result = calc_emc_park(req)

    # Collect all incentives
    incentives = [
        cs_result, anchor_result, focus_result,
        interest_result, stamp_result, patent_result,
        land_result, elec_result, skill_result,
        epf_result, lease_result, logistics_result,
        semi_result, emc_result,
    ]

    # Grand total
    grand_total = (
        total_cs
        + interest_result.amount
        + stamp_result.amount
        + patent_result.amount
        + land_result.amount
        + elec_result.amount
        + epf_result.amount
        + lease_result.amount
        + logistics_result.amount
        + semi_result.amount
        + emc_result.amount
    )

    # 100% FCI overall cap (excluding PLI)
    fci_cap_applied = grand_total > fci
    final_total = min(grand_total, fci)

    # Disbursement schedules
    all_disb = cs_disb + interest_disb + epf_disb + lease_disb

    # Disclaimers
    disclaimers = [
        "This is an estimate based on the UP Electronics Manufacturing Policy 2020. Actual subsidy is subject to evaluation by Financial Institutions / Banks / Financial Consultants or a committee constituted by the State Government.",
        "All incentives are over and above GOI incentives. Total incentives from all sources (excluding PLI) shall not exceed 100% of FCI.",
        "All incentives are eligible upon commencement of commercial production.",
    ]
    if req.is_goi_evaluated:
        disclaimers.append("Refurbished machinery dispensation is available for only the first 20 investors from the date of policy notification.")

    eligible_count = sum(1 for i in incentives if i.eligible)
    ineligible_count = len(incentives) - eligible_count
    pct = (final_total / fci * 100) if fci > 0 else 0

    return CalculateResponse(
        fci_result=fci_result,
        incentives=incentives,
        disbursement_schedule=all_disb,
        grand_total=round(grand_total, 4),
        fci_cap_applied=fci_cap_applied,
        final_total=round(final_total, 4),
        total_as_pct_of_fci=round(pct, 2),
        eligible_count=eligible_count,
        ineligible_count=ineligible_count,
        disclaimers=disclaimers,
    )
