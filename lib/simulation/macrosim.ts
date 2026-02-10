import type { Simulation, SimulationState, MetricDefinition } from '@/types/simulation';
import { initializeState } from './engine';

/**
 * Macroeconomic Policy Simulator - Complete simulation definition
 * 
 * This simulation puts students in the role of an Economic Policy Advisor
 * governing Econland, dealing with various economic crises and policy decisions.
 */

const initialState: SimulationState = initializeState();

const macroMetrics: MetricDefinition[] = [
  { key: 'inflation', label: 'Inflation', format: 'percent', min: 0, max: 20, chartType: 'line' },
  { key: 'gdpGrowth', label: 'GDP Growth', format: 'percent', min: -10, max: 10, chartType: 'line' },
  { key: 'unemployment', label: 'Unemployment', format: 'percent', min: 0, max: 20, chartType: 'bar' },
  { key: 'governmentDebt', label: 'Gov. Debt', format: 'percent', min: 0, max: 200, chartType: 'line' },
  { key: 'publicConfidence', label: 'Confidence', format: 'index', min: 0, max: 100, chartType: 'line' },
];

export const macroeconomicSimulation: Simulation = {
  id: 'macroeconomic-policy',
  title: 'Macroeconomic Policy Simulator',
  description: 'Make critical economic policy decisions and see their real-world impacts on inflation, GDP, unemployment, and public confidence.',
  tags: ['Macroeconomics', 'Inflation', 'Policy', 'Economic Theory'],
  timeEstimate: '2-3 mins',
  concepts: [
    'AD-AS Model',
    'Phillips Curve',
    'Monetary Policy',
    'Fiscal Policy',
    'Interest Rates',
    'Inflation',
    'Unemployment',
  ],
  context: `You are governing the economy of Econland, a mid-sized economy facing rising inflation, 
slowing growth, and public pressure ahead of elections. Each decision you make will ripple through 
the economy, affecting millions of lives. There are no right or wrong answers—only trade-offs and 
consequences.`,
  initialState,
  metrics: macroMetrics,
  resultsConfig: {
    chartMetrics: ['inflation', 'gdpGrowth', 'unemployment', 'publicConfidence'],
    summaryMetrics: ['inflation', 'gdpGrowth', 'unemployment', 'governmentDebt', 'publicConfidence'],
  },
  steps: [
    {
      id: 'oil_price_shock',
      event: `Oh no—global oil prices just surged by 20% due to geopolitical tensions. 
Gas prices are climbing at the pump, and inflation is starting to spike. Consumers are worried 
about their budgets, and businesses are feeling the squeeze on their margins.`,
      decisions: [
        {
          id: 'raise_rates_aggressive',
          text: 'Raise interest rates aggressively to cool inflation immediately',
          effects: {
            inflation: -2.5,
            gdpGrowth: -2.0,
            unemployment: +1.2,
            publicConfidence: -8,
          },
          feedback: 'Markets react immediately. Borrowing slows dramatically, and inflation begins to cool—but layoffs rise as businesses cut costs.',
        },
        {
          id: 'raise_rates_gradual',
          text: 'Adjust interest rates gradually to manage inflation without shocking the economy',
          effects: {
            inflation: -1.2,
            gdpGrowth: -0.8,
            unemployment: +0.5,
            publicConfidence: -3,
          },
          feedback: 'The economy adapts smoothly. Inflation moderates, but some price pressures remain. Employment stays relatively stable.',
        },
        {
          id: 'maintain_rates',
          text: 'Maintain current rates and focus on protecting jobs and growth',
          effects: {
            inflation: +1.5,
            gdpGrowth: +0.3,
            unemployment: -0.2,
            publicConfidence: +2,
          },
          feedback: 'Jobs remain protected, but inflation continues to climb. Consumers notice prices rising faster than their wages.',
        },
        {
          id: 'fiscal_response',
          text: 'Use fiscal policy instead—subsidize energy costs for consumers and businesses',
          effects: {
            inflation: -0.8,
            governmentDebt: +5,
            gdpGrowth: +0.5,
            publicConfidence: +5,
          },
          feedback: 'People appreciate the relief, but government debt increases. The subsidy helps but may not be sustainable long-term.',
        },
      ],
    },
    {
      id: 'unemployment_concerns',
      event: `Three months later, unemployment is rising in key manufacturing regions. 
Local politicians are demanding action. Voters are concerned about job security, and the media 
is highlighting factory closures.`,
      decisions: [
        {
          id: 'stimulus_package',
          text: 'Launch a major job creation stimulus package',
          effects: {
            unemployment: -1.5,
            gdpGrowth: +1.2,
            governmentDebt: +8,
            inflation: +0.8,
            publicConfidence: +10,
          },
          feedback: 'New infrastructure projects create thousands of jobs. The economy surges, but debt levels climb and inflation picks up.',
        },
        {
          id: 'training_programs',
          text: 'Invest in workforce retraining and education programs',
          effects: {
            unemployment: -0.5,
            governmentDebt: +3,
            publicConfidence: +5,
            gdpGrowth: +0.3,
          },
          feedback: 'Workers gain new skills, improving long-term competitiveness. The impact is gradual but sustainable.',
        },
        {
          id: 'cut_rates_jobs',
          text: 'Cut interest rates to stimulate investment and job creation',
          effects: {
            unemployment: -0.8,
            inflation: +1.5,
            gdpGrowth: +1.0,
            publicConfidence: +3,
          },
          feedback: 'Businesses expand and hire more workers. However, inflation accelerates, eroding purchasing power.',
        },
        {
          id: 'let_market_adjust',
          text: 'Let the market adjust naturally—focus on maintaining price stability',
          effects: {
            unemployment: +0.3,
            inflation: -0.5,
            publicConfidence: -5,
            gdpGrowth: -0.2,
          },
          feedback: 'Price stability improves, but some regions face prolonged job losses. Public frustration grows.',
        },
      ],
    },
    {
      id: 'election_pressure',
      event: `Election season is heating up. Your approval ratings are dropping as opponents 
criticize economic policies. Prominent business leaders are calling for more predictable policy, 
while labor unions demand stronger worker protections.`,
      decisions: [
        {
          id: 'appease_business',
          text: 'Cut business taxes and reduce regulations to gain business support',
          effects: {
            gdpGrowth: +1.5,
            unemployment: -0.5,
            governmentDebt: +4,
            publicConfidence: +3,
            inflation: +0.3,
          },
          feedback: 'Business investment surges, but critics say you\'re favoring corporations over workers. The economy grows, but inequality concerns rise.',
        },
        {
          id: 'worker_protections',
          text: 'Strengthen worker protections and raise minimum wages',
          effects: {
            unemployment: +0.8,
            publicConfidence: +7,
            inflation: +0.5,
            gdpGrowth: -0.5,
          },
          feedback: 'Workers celebrate the protections, boosting your approval. However, some businesses reduce hiring due to higher costs.',
        },
        {
          id: 'balanced_approach',
          text: 'Take a balanced approach—small benefits for both business and workers',
          effects: {
            gdpGrowth: +0.4,
            unemployment: +0.1,
            publicConfidence: +2,
            governmentDebt: +2,
          },
          feedback: 'A moderate compromise that doesn\'t fully satisfy either side, but maintains stability without major shocks.',
        },
        {
          id: 'ignore_politics',
          text: 'Ignore political pressure and stick to your economic principles',
          effects: {
            publicConfidence: -8,
            inflation: -0.3,
            gdpGrowth: +0.1,
          },
          feedback: 'Economic indicators remain stable, but public trust erodes. Your approval ratings continue to fall.',
        },
      ],
    },
    {
      id: 'debt_crisis',
      event: `Warning lights are flashing. Government debt has reached concerning levels, 
and credit rating agencies are hinting at a potential downgrade. International markets are 
getting nervous, and borrowing costs are rising.`,
      decisions: [
        {
          id: 'austerity_measures',
          text: 'Implement austerity—cut spending and raise taxes to reduce debt',
          effects: {
            governmentDebt: -8,
            gdpGrowth: -2.0,
            unemployment: +1.5,
            publicConfidence: -12,
            inflation: -0.5,
          },
          feedback: 'Debt levels improve, but the economy contracts sharply. Unemployment spikes, and public anger mounts.',
        },
        {
          id: 'targeted_cuts',
          text: 'Make targeted cuts to non-essential programs while protecting key services',
          effects: {
            governmentDebt: -3,
            gdpGrowth: -0.8,
            unemployment: +0.5,
            publicConfidence: -5,
          },
          feedback: 'Debt moderates without catastrophic cuts. Some services are reduced, but core functions remain.',
        },
        {
          id: 'growth_priority',
          text: 'Prioritize growth—maintain spending and hope growth will reduce debt ratio',
          effects: {
            governmentDebt: +3,
            gdpGrowth: +1.2,
            unemployment: -0.5,
            publicConfidence: +2,
            inflation: +0.5,
          },
          feedback: 'The economy grows, which helps, but absolute debt continues rising. Markets remain cautious.',
        },
        {
          id: 'debt_restructure',
          text: 'Restructure debt with longer maturities to buy time',
          effects: {
            governmentDebt: -2,
            publicConfidence: -3,
            gdpGrowth: +0.2,
          },
          feedback: 'You gain breathing room, but markets see this as a sign of financial stress. Credibility takes a hit.',
        },
      ],
    },
    {
      id: 'trade_war',
      event: `A major trading partner has imposed tariffs on your exports. Your manufacturing 
sector is reeling, and exporters are laying off workers. Retaliatory measures are being 
discussed, but they could escalate tensions further.`,
      decisions: [
        {
          id: 'retaliate_tariffs',
          text: 'Retaliate with matching tariffs to show strength',
          effects: {
            gdpGrowth: -1.8,
            unemployment: +1.0,
            inflation: +0.8,
            publicConfidence: +4,
          },
          feedback: 'National pride soars, but trade volumes collapse. Prices rise on imported goods, and export-dependent industries suffer.',
        },
        {
          id: 'negotiate_diplomacy',
          text: 'Pursue diplomatic negotiations to resolve the dispute',
          effects: {
            gdpGrowth: -0.5,
            unemployment: +0.3,
            publicConfidence: -2,
          },
          feedback: 'Negotiations drag on. Some damage is done, but you avoid a full trade war. Critics say you look weak.',
        },
        {
          id: 'diversify_exports',
          text: 'Diversify export markets and reduce dependence on that partner',
          effects: {
            gdpGrowth: -0.3,
            unemployment: +0.2,
            publicConfidence: +1,
          },
          feedback: 'Long-term strategy pays off as new markets open. Short-term pain, but better resilience for the future.',
        },
        {
          id: 'subsidize_exporters',
          text: 'Subsidize affected exporters to help them stay competitive',
          effects: {
            gdpGrowth: +0.2,
            unemployment: -0.3,
            governmentDebt: +4,
            inflation: +0.3,
          },
          feedback: 'Exporters survive the crisis, but government spending increases. The subsidy may become permanent.',
        },
      ],
    },
    {
      id: 'recession_warning',
      event: `Leading economic indicators are flashing red. GDP growth is slowing, 
consumer spending is weakening, and business confidence is plummeting. Some economists are 
predicting a recession within six months.`,
      decisions: [
        {
          id: 'emergency_stimulus',
          text: 'Launch emergency fiscal stimulus—direct payments and infrastructure spending',
          effects: {
            gdpGrowth: +2.5,
            unemployment: -1.2,
            governmentDebt: +10,
            inflation: +1.2,
            publicConfidence: +8,
          },
          feedback: 'The economy bounces back quickly. Consumer spending surges, and jobs return. But debt reaches new heights, and inflation accelerates.',
        },
        {
          id: 'monetary_easing',
          text: 'Cut interest rates aggressively to stimulate borrowing and spending',
          effects: {
            gdpGrowth: +1.5,
            unemployment: -0.8,
            inflation: +2.0,
            publicConfidence: +5,
          },
          feedback: 'Cheap money floods the economy. Growth rebounds, but inflation jumps, and asset bubbles form.',
        },
        {
          id: 'targeted_support',
          text: 'Provide targeted support to vulnerable sectors only',
          effects: {
            gdpGrowth: +0.8,
            unemployment: -0.4,
            governmentDebt: +3,
            publicConfidence: +3,
          },
          feedback: 'You help the most affected areas without massive spending. Modest improvement, but some sectors still struggle.',
        },
        {
          id: 'wait_and_see',
          text: 'Wait and see—let automatic stabilizers work before intervening',
          effects: {
            gdpGrowth: -0.5,
            unemployment: +0.8,
            publicConfidence: -5,
            governmentDebt: +1,
          },
          feedback: 'The recession deepens before recovery begins. You saved money, but the human cost is higher.',
        },
      ],
    },
    {
      id: 'final_policy_review',
      event: `It's been a year since you took office. The economy has weathered multiple 
crises. Now you face a final major decision: the central bank wants to normalize interest 
rates after emergency measures, but doing so could slow the recovery you've worked hard to 
achieve.`,
      decisions: [
        {
          id: 'normalize_rates',
          text: 'Normalize rates—return to standard monetary policy for long-term stability',
          effects: {
            inflation: -1.5,
            gdpGrowth: -1.0,
            unemployment: +0.5,
            publicConfidence: -3,
          },
          feedback: 'Monetary policy returns to normal. Inflation cools, but growth slows. You\'ve set the economy on a sustainable path.',
        },
        {
          id: 'keep_rates_low',
          text: 'Keep rates low to sustain the recovery momentum',
          effects: {
            gdpGrowth: +0.5,
            unemployment: -0.3,
            inflation: +1.0,
            publicConfidence: +2,
          },
          feedback: 'Growth continues, but inflation becomes entrenched. Future policymakers will face difficult choices.',
        },
        {
          id: 'gradual_normalization',
          text: 'Normalize gradually over two years to balance growth and stability',
          effects: {
            inflation: -0.8,
            gdpGrowth: -0.3,
            unemployment: +0.2,
            publicConfidence: +1,
          },
          feedback: 'A measured approach that balances competing goals. The economy adjusts smoothly to new conditions.',
        },
        {
          id: 'coordinate_fiscal_monetary',
          text: 'Coordinate fiscal tightening with monetary normalization for balanced approach',
          effects: {
            inflation: -1.0,
            governmentDebt: -2,
            gdpGrowth: -0.5,
            unemployment: +0.3,
            publicConfidence: 0,
          },
          feedback: 'A comprehensive strategy that addresses both fiscal and monetary concerns. The transition is smooth but not painless.',
        },
      ],
    },
  ],
};
