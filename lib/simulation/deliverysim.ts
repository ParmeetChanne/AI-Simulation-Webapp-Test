import type { Simulation, SimulationState, MetricDefinition } from '@/types/simulation';

/**
 * Microecon 1000: Campus Food Delivery Platform (Swipe Simulation)
 *
 * Tinder-style: each step is a "card" with 2 decisions (reject/accept).
 */

const initialState: SimulationState = {
  activeUsers: 800,
  partnerRestaurants: 8,
  averageCommissionPct: 15,
  platformProfit: 250,
  userSatisfaction: 70,
  competitivePressure: 20,
};

const deliveryMetrics: MetricDefinition[] = [
  { key: 'activeUsers', label: 'Active users', format: 'integer', min: 0, max: 20000, chartType: 'line' },
  { key: 'partnerRestaurants', label: 'Partner restaurants', format: 'integer', min: 0, max: 200, chartType: 'line' },
  { key: 'averageCommissionPct', label: 'Avg commission', format: 'percent', min: 5, max: 35, chartType: 'line' },
  { key: 'platformProfit', label: 'Platform profit', format: 'currency', min: -5000, max: 20000, chartType: 'line' },
  { key: 'userSatisfaction', label: 'User satisfaction', format: 'index', min: 0, max: 100, chartType: 'line' },
  { key: 'competitivePressure', label: 'Competitive pressure', format: 'index', min: 0, max: 100, chartType: 'line' },
];

export const deliveryPlatformSimulation: Simulation = {
  id: 'microecon-delivery-platform',
  title: 'Microecon 1000: Campus Delivery Platform',
  description:
    'Run a food delivery platform around campus. Swipe through strategic decisions about onboarding, commissions, discounts, differentiation, and competition.',
  tags: ['Microeconomics', 'Monopolistic competition', 'Platform economics', 'Swipe'],
  timeEstimate: '2–3 mins',
  concepts: [
    'Monopolistic competition',
    'Pricing power',
    'Product differentiation',
    'Network effects',
    'Competitive pressure',
    'Barriers to entry',
  ],
  context: `You are the manager of a food delivery app operating around a university campus.
You connect restaurants and students.

You decide which restaurants to onboard, which customers to prioritize, how much commission to charge, and how to compete vs differentiate.

You are NOT a price taker. You have some market power, but competitors exist.`,
  initialState,
  metrics: deliveryMetrics,
  resultsConfig: {
    chartMetrics: ['platformProfit', 'activeUsers', 'partnerRestaurants', 'userSatisfaction', 'competitivePressure', 'averageCommissionPct'],
    summaryMetrics: ['platformProfit', 'activeUsers', 'partnerRestaurants', 'averageCommissionPct', 'userSatisfaction', 'competitivePressure'],
  },
  reflectionQuestions: [
    'At what point did increasing prices reduce long-run profits?',
    'Why didn\'t you behave like a price taker?',
  ],
  steps: [
    {
      id: 'r1_card1_local_restaurant',
      event: `A popular student-run burger place wants to join your platform.\nThey want a low commission (10%).`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Reject / keep commission higher',
          effects: { platformProfit: 120, activeUsers: -40, userSatisfaction: -2, competitivePressure: 1 },
          feedback: 'You preserved margin, but growth slowed. Students have fewer options and may multi-home onto rivals.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Accept at low commission',
          effects: { partnerRestaurants: 1, averageCommissionPct: -1.0, activeUsers: 160, platformProfit: 40, userSatisfaction: 4 },
          feedback: 'You grew the supply side fast, but your pricing power (margin per order) softened.',
        },
      ],
      aiExplanation: 'Accepting lower commissions can accelerate network effects (more restaurants → more users), but it limits pricing power.',
    },
    {
      id: 'r1_card3_fast_delivery',
      event: `Students complain that delivery is slow at peak hours.\nDo you invest in faster dispatch (more couriers, better routing)?`,
      decisions: [
        {
          id: 'reject',
          text: "Swipe left: Don't invest (protect margins)",
          effects: { platformProfit: 120, activeUsers: -80, userSatisfaction: -8, competitivePressure: 4 },
          feedback: 'You saved money, but service quality fell. Switching risk rises when satisfaction drops.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Invest in faster dispatch',
          effects: { platformProfit: -220, activeUsers: 220, userSatisfaction: 10, competitivePressure: -2 },
          feedback: 'Better service boosts satisfaction and demand, but costs increase in the short run.',
        },
      ],
      aiExplanation: 'Service quality is differentiation. It can be more sustainable than price cuts, but it requires spending.',
    },
    {
      id: 'r2_card1_commission_increase',
      event: `Your app is now popular.\nYou consider increasing commission from 15% → 25%.`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Keep commission the same',
          effects: { platformProfit: 140, partnerRestaurants: 0, userSatisfaction: 1, competitivePressure: -1 },
          feedback: 'Stability builds trust. You left money on the table, but suppliers stayed put.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Increase commission',
          effects: { averageCommissionPct: 5, platformProfit: 700, partnerRestaurants: -2, activeUsers: -90, userSatisfaction: -6, competitivePressure: 6 },
          feedback: 'Market power raises profit—until suppliers and users start drifting away.',
        },
      ],
      aiExplanation: 'Price-setting power exists, but excessive pricing pushes suppliers away and can weaken the network.',
    },
    {
      id: 'r2_card2_student_discounts',
      event: `Students demand lower delivery fees.\nDo you offer discounts?`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Decline discounts',
          effects: { platformProfit: 220, activeUsers: -130, userSatisfaction: -8, competitivePressure: 3 },
          feedback: 'Margins improved, but demand softened and switching risk rose.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Offer discounts',
          effects: { platformProfit: -260, activeUsers: 420, userSatisfaction: 9, competitivePressure: -4 },
          feedback: 'Discounts boost demand in elastic segments, but they compress margins.',
        },
      ],
      aiExplanation: 'When demand is elastic, small price changes can cause large quantity changes.',
    },
    {
      id: 'r3_card0_competitor_enters',
      event: `External shock: a competing delivery app enters the campus market.`,
      externalEffects: { competitivePressure: 20, userSatisfaction: -3, activeUsers: -80 },
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Ignore the entrant (stay the course)',
          effects: { platformProfit: 80, activeUsers: -120, competitivePressure: 6 },
          feedback: 'You preserved margins, but you started losing users to the entrant.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Respond immediately (campaign + outreach)',
          effects: { platformProfit: -180, activeUsers: 160, competitivePressure: -4, userSatisfaction: 2 },
          feedback: 'Fast response slows churn, but costs spike during the fight.',
        },
      ],
      aiExplanation: 'Competition increases switching and reduces effective market power. Response speed can matter.',
    },
    {
      id: 'r3_summary',
      event: `Review how your choices affected loyalty, profit, and pressure.`,
      decisions: [{ id: 'continue', text: 'View Results', effects: {} }],
    },
  ],
};
