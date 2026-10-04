/**
 * Punjab & Gurdaspur Property Registry & Stamp Duty Calculation Engine (2026)
 * 
 * Centralized rates and statutory fee slabs for property registration in Punjab.
 * Rates structure:
 * - Female Sole Owner: 5% Indicative Stamp Duty (3% Base Stamp Duty + 1% Social Security Fund + 1% PIDB)
 * - Joint Ownership (Male + Female): 6% Indicative Stamp Duty (4% Base Stamp Duty + 1% Social Security Fund + 1% PIDB)
 * - Male Sole Owner: 7% Indicative Stamp Duty (5% Base Stamp Duty + 1% Social Security Fund + 1% PIDB)
 * - Registration Fee: 1% of calculation value (Sub-Registrar Tehsil standard)
 * - PLRS Facilitation Charges: ₹2,500
 * - Mutation (Inteqaal) Fee: ₹300
 * - Other Statutory / Pasting Charges: ₹200
 */

export const BUYER_TYPES = [
  {
    id: 'female',
    title: 'Female Buyer',
    subtitle: 'Sole female ownership',
    ratePercent: 5,
    baseRatePercent: 3,
    cessPercent: 2,
    badgeText: '2% Rebate Benefit',
    description: 'Indicative Stamp Duty Rate: 5%',
  },
  {
    id: 'joint',
    title: 'Joint Buyer',
    subtitle: 'Male + Female co-ownership',
    ratePercent: 6,
    baseRatePercent: 4,
    cessPercent: 2,
    badgeText: '1% Rebate Benefit',
    description: 'Indicative Stamp Duty Rate: 6%',
  },
  {
    id: 'male',
    title: 'Male Buyer',
    subtitle: 'Standard male ownership',
    ratePercent: 7,
    baseRatePercent: 5,
    cessPercent: 2,
    badgeText: 'Standard Slab',
    description: 'Indicative Stamp Duty Rate: 7%',
  },
];

export const PROPERTY_TYPES = [
  { id: 'residential', label: 'Residential', icon: 'Home' },
  { id: 'commercial', label: 'Commercial', icon: 'Building' },
  { id: 'agricultural', label: 'Agricultural', icon: 'Wheat' },
  { id: 'plot', label: 'Plot', icon: 'Square' },
  { id: 'other', label: 'Other', icon: 'Layers' },
];

export const GURDASPUR_TEHSILS = [
  'Gurdaspur (Main Tehsil)',
  'Batala',
  'Dinanagar',
  'Dera Baba Nanak',
  'Fatehgarh Churian',
  'Qadian',
];

export const STATUTORY_SLABS = {
  registrationFeePercent: 1, // 1% registration fee
  plrsFacilitationFee: 2500, // PLRS Punjab online system fee
  mutationFee: 300,          // Inteqaal entry charge
  otherCharges: 200,         // Pasting / documentation slip
};

/**
 * Formats a number to Indian Rupee notation (e.g. 35,00,000)
 */
export function formatIndianNumber(value) {
  const num = Math.round(Number(value) || 0);
  return num.toLocaleString('en-IN');
}

/**
 * Calculates complete itemized Punjab property registry expenses
 */
export function calculatePunjabRegistry({
  agreementValue = 0,
  collectorRate = 0,
  buyerType = 'female',
  propertyType = 'residential',
  district = 'Gurdaspur',
  tehsil = 'Gurdaspur (Main Tehsil)',
}) {
  const valAgreement = Math.max(0, parseFloat(agreementValue) || 0);
  const valCollector = Math.max(0, parseFloat(collectorRate) || 0);

  // Applicable value is the higher of transaction/agreement value and collector rate
  const calculationValue = Math.max(valAgreement, valCollector);
  const higherUsed = valCollector > valAgreement ? 'collector' : 'agreement';

  const buyerConfig = BUYER_TYPES.find((b) => b.id === buyerType) || BUYER_TYPES[0];

  // Stamp Duty (Base Duty e.g. 3%/4%/5%)
  const stampDutyRate = buyerConfig.baseRatePercent / 100;
  const stampDutyAmount = Math.round(calculationValue * stampDutyRate);

  // Applicable Cess / Development Charges (1% Social Security + 1% PIDB = 2%)
  const cessRate = buyerConfig.cessPercent / 100;
  const cessAmount = Math.round(calculationValue * cessRate);

  // Total Stamp Duty + Cess combined indicative rate (5%, 6%, or 7%)
  const totalStampDutyAndCess = stampDutyAmount + cessAmount;

  // Registration Fee (1% at Tehsil)
  const regFeeRate = STATUTORY_SLABS.registrationFeePercent / 100;
  const registrationFee = Math.round(calculationValue * regFeeRate);

  // Fixed statutory slabs
  const facilitationCharges = STATUTORY_SLABS.plrsFacilitationFee;
  const mutationFee = STATUTORY_SLABS.mutationFee;
  const otherCharges = STATUTORY_SLABS.otherCharges;

  // Total Estimated Registry Cost
  const totalRegistryCost = 
    stampDutyAmount + 
    cessAmount + 
    registrationFee + 
    facilitationCharges + 
    mutationFee + 
    otherCharges;

  // Calculate potential savings compared to male buyer (7%)
  const maleStampDuty = Math.round(calculationValue * 0.07);
  const maleTotal = maleStampDuty + registrationFee + facilitationCharges + mutationFee + otherCharges;
  const femaleSavings = Math.max(0, maleTotal - totalRegistryCost);

  return {
    calculationValue,
    agreementValue: valAgreement,
    collectorRate: valCollector,
    higherUsed,
    buyerType: buyerConfig,
    propertyType,
    district,
    tehsil,
    // Itemized values
    stampDutyRate: buyerConfig.baseRatePercent,
    stampDutyAmount,
    cessRate: buyerConfig.cessPercent,
    cessAmount,
    totalStampDutyAndCess,
    combinedStampRate: buyerConfig.ratePercent,
    registrationFee,
    registrationFeeRate: STATUTORY_SLABS.registrationFeePercent,
    facilitationCharges,
    mutationFee,
    otherCharges,
    totalRegistryCost,
    femaleSavings,
    // Step by step breakdown formulas for transparency
    breakdownSteps: [
      {
        item: 'Stamp Duty (Punjab Govt Base)',
        rate: `${buyerConfig.baseRatePercent}%`,
        formula: `₹${formatIndianNumber(calculationValue)} × ${buyerConfig.baseRatePercent}%`,
        amount: stampDutyAmount,
      },
      {
        item: 'Social Security Fund & PIDB Cess',
        rate: `${buyerConfig.cessPercent}%`,
        formula: `₹${formatIndianNumber(calculationValue)} × ${buyerConfig.cessPercent}% (1% SSF + 1% PIDB)`,
        amount: cessAmount,
      },
      {
        item: 'Sub-Registrar Registration Fee',
        rate: `${STATUTORY_SLABS.registrationFeePercent}%`,
        formula: `₹${formatIndianNumber(calculationValue)} × ${STATUTORY_SLABS.registrationFeePercent}%`,
        amount: registrationFee,
      },
      {
        item: 'PLRS Facilitation Charges',
        rate: 'Fixed Slab',
        formula: 'Punjab Land Records Society online processing fee',
        amount: facilitationCharges,
      },
      {
        item: 'Mutation (Inteqaal) Fee',
        rate: 'Fixed Slab',
        formula: 'Standard Sub-Tehsil revenue record entry fee',
        amount: mutationFee,
      },
      {
        item: 'Other Statutory & Pasting Charges',
        rate: 'Fixed Slab',
        formula: 'Official document handling, scanning & pasting charges',
        amount: otherCharges,
      },
    ],
  };
}
