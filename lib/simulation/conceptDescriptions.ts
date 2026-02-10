/**
 * Short descriptions for simulation concepts (used on results page).
 */
export const conceptDescriptions: Record<string, string> = {
  'AD-AS Model': 'Aggregate Demand-Aggregate Supply model shows how price levels and output interact in the economy.',
  'Phillips Curve': 'The relationship between inflation and unemployment, showing trade-offs in macroeconomic policy.',
  'Monetary Policy': 'Central bank actions (interest rates) that influence money supply, inflation, and economic growth.',
  'Fiscal Policy': 'Government spending and taxation decisions that affect aggregate demand and economic activity.',
  'Interest Rates': 'The cost of borrowing money, a key tool for controlling inflation and stimulating growth.',
  'Inflation': 'The rate at which prices rise, eroding purchasing power but sometimes accompanying growth.',
  'Unemployment': 'The percentage of workers without jobs, a key indicator of economic health and social welfare.',
  'Policy incidence': 'Who ultimately bears the cost of a tax or policy - employers, workers, or consumers.',
  'Elastic vs inelastic demand': 'How much quantity demanded changes when price changes; elastic demand is more responsive.',
  'Total revenue': 'Total revenue equals price × quantity. Whether a price increase raises revenue depends on elasticity.',
  'Normal goods': 'Goods for which demand increases when income rises (and decreases when income falls).',
  'Cross-price elasticity': 'How demand for a good changes when the price of a related good (substitute or complement) changes.',
  'Trade-offs between profit and welfare': 'Firm and policy choices often involve balancing profits with customer or worker wellbeing.',
  'Short-run vs long-run effects': 'Some policies help in the short run but hurt in the long run (or vice versa); timing matters.',
  'Monopolistic competition': 'A market with many firms selling differentiated products; firms have some pricing power but face competitive pressure.',
  'Pricing power': 'A firm’s ability to set prices (or commissions) above marginal cost without losing all customers.',
  'Product differentiation': 'Making your product feel different (quality, variety, brand, service) so demand is less price-sensitive.',
  'Network effects': 'When a product becomes more valuable as more people use it (e.g., more restaurants attracts more users, and vice versa).',
  'Competitive pressure': 'The threat from rivals and substitutes that limits your ability to raise prices and keeps customers from switching.',
  'Barriers to entry': 'Obstacles that make it harder for new competitors to enter (exclusivity, scale, brand, contracts).',
};

export function getConceptDescription(concept: string): string {
  return conceptDescriptions[concept] ?? 'A key idea you explored in this simulation.';
}
