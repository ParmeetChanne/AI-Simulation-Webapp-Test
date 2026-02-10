import type { Simulation, SimulationState, MetricDefinition } from '@/types/simulation';

/**
 * Microecon 1000: Café Owner Simulation
 * Student runs a small café near campus; 4 periods with policy shocks and decisions.
 */

const initialState: SimulationState = {
  coffeePrice: 4,
  dailyDemand: 200,
  wage: 15,
  workers: 4,
  dailyProfit: 320,
  studentSatisfaction: 80,
};

const cafeMetrics: MetricDefinition[] = [
  { key: 'coffeePrice', label: 'Coffee price', format: 'currency', min: 1, max: 10, chartType: 'line' },
  { key: 'dailyDemand', label: 'Daily demand', format: 'integer', min: 50, max: 400, chartType: 'line' },
  { key: 'wage', label: 'Wage (per hour)', format: 'currency', min: 10, max: 25, chartType: 'line' },
  { key: 'workers', label: 'Workers', format: 'integer', min: 0, max: 10, chartType: 'bar' },
  { key: 'dailyProfit', label: 'Daily profit', format: 'currency', min: -100, max: 600, chartType: 'line' },
  { key: 'studentSatisfaction', label: 'Student satisfaction', format: 'index', min: 0, max: 100, chartType: 'line' },
];

export const cafeSimulation: Simulation = {
  id: 'microecon-cafe',
  title: 'Microecon 1000: Café Owner (Chapter 6)',
  description: 'Run a small campus café. Face rent, wages, and competition while responding to policy shocks such as minimum wage, rent control, and sugar tax.',
  tags: ['Microeconomics', 'Policy incidence', 'Elasticity', 'Firm behavior'],
  timeEstimate: '3–4 mins',
  concepts: [
    'Policy incidence',
    'Elastic vs inelastic demand',
    'Trade-offs between profit and welfare',
    'Short-run vs long-run effects',
  ],
  context: `You are the owner of a small café located near a university campus. You sell coffee and pastries, employ student workers (hourly wage), and face rent, ingredient costs, and competition from nearby cafés. Each period you'll face events and make decisions that affect your profit, demand, and student satisfaction.`,
  initialState,
  metrics: cafeMetrics,
  resultsConfig: {
    chartMetrics: ['dailyProfit', 'coffeePrice', 'dailyDemand', 'studentSatisfaction', 'workers'],
    summaryMetrics: ['dailyProfit', 'coffeePrice', 'workers', 'studentSatisfaction'],
  },
  steps: [
    {
      id: 'period1_baseline',
      event: `It's the start of the semester. Business is steady.`,
      decisions: [
        {
          id: 'keep_prices',
          text: 'Keep prices the same',
          effects: {
            dailyDemand: 0,
            dailyProfit: 0,
            studentSatisfaction: 0,
          },
          feedback: 'Keeping prices stable left demand and profit unchanged. A safe baseline.',
        },
        {
          id: 'lower_prices',
          text: 'Slightly lower prices to attract more students',
          effects: {
            dailyDemand: 30,
            dailyProfit: -20,
            studentSatisfaction: 5,
          },
          feedback: 'Lowering prices increased demand, but because your costs stayed the same, profits didn\'t rise much. This hints at how demand responsiveness matters.',
        },
        {
          id: 'raise_prices',
          text: 'Raise prices to increase margins',
          effects: {
            dailyDemand: -25,
            dailyProfit: 10,
            studentSatisfaction: -8,
          },
          feedback: 'Higher prices boosted margin per cup, but demand fell. Profit change is uncertain; some students switched to competitors.',
        },
      ],
      aiExplanation: 'How you price affects both volume and margin. Demand responsiveness (elasticity) will matter more in later shocks.',
    },
    {
      id: 'period2_minimum_wage',
      event: `A new minimum wage law increases wages from $15 to $18/hour. You did not choose this—you must respond to it.`,
      externalEffects: { wage: 3 },
      decisions: [
        {
          id: 'raise_coffee_prices',
          text: 'Raise coffee prices',
          effects: {
            coffeePrice: 0.5,
            dailyDemand: -15,
            dailyProfit: -30,
            studentSatisfaction: -5,
          },
          feedback: 'You passed some of the cost to customers. Demand dipped and satisfaction slipped; profit is mixed.',
        },
        {
          id: 'reduce_staff_hours',
          text: 'Reduce staff hours',
          effects: {
            workers: -0.5,
            dailyDemand: -20,
            dailyProfit: 25,
            studentSatisfaction: -10,
          },
          feedback: 'Fewer hours cut labor cost and helped profit, but service suffered and demand dropped.',
        },
        {
          id: 'absorb_cost',
          text: 'Absorb the cost increase',
          effects: {
            dailyProfit: -80,
            dailyDemand: 0,
            studentSatisfaction: 2,
          },
          feedback: 'You kept prices and service the same. Profit took a hit; students noticed no change.',
        },
        {
          id: 'self_serve_kiosks',
          text: 'Replace some workers with self-serve kiosks',
          effects: {
            workers: -1.5,
            dailyProfit: 40,
            dailyDemand: 0,
            studentSatisfaction: -5,
          },
          feedback: 'Kiosks cut labor cost and boosted profit, but employment fell and some students prefer human service.',
        },
      ],
      aiExplanation: 'Although the law targeted employers, the burden didn\'t fall only on you. Some costs were passed to consumers through higher prices—this is tax (or policy) incidence.',
    },
    {
      id: 'period3_rent_control',
      event: `The city introduces rent control to help students afford housing. Your rent stays the same, but fewer new cafés open, so long-run supply of coffee shops tightens.`,
      decisions: [
        {
          id: 'increase_prices_less_competition',
          text: 'Increase prices due to less competition',
          effects: {
            coffeePrice: 0.6,
            dailyProfit: 50,
            studentSatisfaction: -12,
            dailyDemand: -10,
          },
          feedback: 'With less competition you raised prices. Profit went up; student satisfaction dropped.',
        },
        {
          id: 'expand_menu',
          text: 'Expand menu and capacity',
          effects: {
            dailyProfit: -40,
            dailyDemand: 35,
            studentSatisfaction: 8,
            workers: 0.5,
          },
          feedback: 'Expansion is risky: costs rose and profit fell short-term, but demand and satisfaction improved.',
        },
        {
          id: 'keep_prices_low_loyalty',
          text: 'Keep prices low to gain loyalty',
          effects: {
            dailyProfit: -25,
            dailyDemand: 20,
            studentSatisfaction: 10,
          },
          feedback: 'Lower short-run profit, but stronger loyalty and demand for the long run.',
        },
      ],
      aiExplanation: 'Although rent control aimed to help renters, it reduced incentives for new businesses to enter. This created shortages and changed market structure.',
    },
    {
      id: 'period4_sugar_tax',
      event: `A new tax is added to sugar-intensive products. Pastries are affected more than coffee.`,
      decisions: [
        {
          id: 'raise_pastry_only',
          text: 'Raise pastry prices only',
          effects: {
            dailyDemand: -18,
            dailyProfit: -15,
            studentSatisfaction: -6,
          },
          feedback: 'Pastry demand dropped more than coffee when you raised pastry prices. Tax burden split by elasticity.',
        },
        {
          id: 'raise_all_prices',
          text: 'Raise all prices',
          effects: {
            coffeePrice: 0.3,
            dailyDemand: -22,
            dailyProfit: -5,
            studentSatisfaction: -8,
          },
          feedback: 'Spreading the tax across the menu softened the hit to pastries but hurt overall demand.',
        },
        {
          id: 'remove_pastries',
          text: 'Remove pastries from the menu',
          effects: {
            dailyDemand: -40,
            dailyProfit: -50,
            studentSatisfaction: -15,
          },
          feedback: 'Dropping pastries cut tax but also cut traffic and profit; many students want both coffee and a snack.',
        },
        {
          id: 'absorb_tax',
          text: 'Absorb tax to stay competitive',
          effects: {
            dailyProfit: -45,
            dailyDemand: 5,
            studentSatisfaction: 5,
          },
          feedback: 'You kept prices unchanged and ate the cost. Demand and satisfaction held up; profit fell.',
        },
      ],
      aiExplanation: 'Because demand for pastries is more elastic than for coffee, raising pastry prices caused a larger drop in quantity sold. You experienced how elasticity shapes who bears the cost.',
    },
  ],
};
