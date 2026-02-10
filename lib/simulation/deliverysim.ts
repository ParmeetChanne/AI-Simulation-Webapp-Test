import type { Simulation, SimulationState, MetricDefinition } from '@/types/simulation';

/**
 * Microecon 1000: Campus Food Delivery Platform (Swipe Simulation)
 *
 * Tinder-style: each step is a "card" with 2 decisions (reject/accept).
 * Rounds are represented as interstitial summary steps (ids ending with _summary).
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
  timeEstimate: '4–6 mins',
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
    'Why didn’t you behave like a price taker?',
  ],
  steps: [
    // ROUND 1 — BUILDING THE PLATFORM
    {
      id: 'r1_card1_local_restaurant',
      event: `ROUND 1 — BUILDING THE PLATFORM\n\nA popular student-run burger place wants to join your platform.\nThey want a low commission (10%).`,
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
      id: 'r1_card2_large_chain',
      event: `A national fast-food chain offers exclusivity, but demands high visibility in the app.`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Reject exclusivity',
          effects: { activeUsers: 40, competitivePressure: 3, platformProfit: 30, userSatisfaction: -1 },
          feedback: 'You stayed flexible, but growth was slower and competitors had an opening.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Accept exclusivity + boost visibility',
          effects: { activeUsers: 320, partnerRestaurants: 1, competitivePressure: -6, platformProfit: 220, userSatisfaction: 2 },
          feedback: 'The big brand draws users and makes it harder for rivals to differentiate, but you now owe them attention.',
        },
      ],
      aiExplanation: 'Brand power can be a form of differentiation. Exclusivity can reduce competitive pressure—at a cost.',
    },
    {
      id: 'r1_card3_fast_delivery',
      event: `Students complain that delivery is slow at peak hours.\nDo you invest in faster dispatch (more couriers, better routing)?`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Don’t invest (protect margins)',
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
      id: 'r1_card4_premium_restaurants',
      event: `A few premium restaurants want to join.\nThey accept higher commissions, but students might find them pricey.`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Ignore premium restaurants',
          effects: { activeUsers: -30, platformProfit: 20, userSatisfaction: 0 },
          feedback: 'You stayed focused, but missed a chance to segment the market.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Onboard premium restaurants',
          effects: { partnerRestaurants: 1, averageCommissionPct: 1.5, platformProfit: 260, activeUsers: 90, userSatisfaction: -2 },
          feedback: 'Higher commissions improve profit per order, but some students dislike pricier options.',
        },
      ],
      aiExplanation: 'With some market power, you can tilt toward margin—but too much hurts satisfaction and long-run demand.',
    },
    {
      id: 'r1_card5_marketing_blast',
      event: `You consider a campus marketing blast (posters + influencer codes).\nIt’s expensive, but could grow the user base quickly.`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Skip marketing (stay lean)',
          effects: { platformProfit: 80, activeUsers: 20, competitivePressure: 2 },
          feedback: 'You stayed lean, but rivals might win mindshare.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Launch the marketing blast',
          effects: { platformProfit: -180, activeUsers: 300, userSatisfaction: 2, competitivePressure: 3 },
          feedback: 'You bought growth. The market notices, including competitors.',
        },
      ],
      aiExplanation: 'Early-stage platforms often trade margins for growth to build network effects.',
    },
    {
      id: 'r1_summary',
      event: `End of Round 1\n\nYou’ve made your early platform-building choices. Review the changes before moving on.`,
      decisions: [{ id: 'continue', text: 'Continue', effects: {} }],
    },

    // ROUND 2 — PRICING POWER EMERGES
    {
      id: 'r2_card1_commission_increase',
      event: `ROUND 2 — PRICING POWER EMERGES\n\nYour app is now popular.\nYou consider increasing commission from 15% → 25%.`,
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
      id: 'r2_card3_priority_customers',
      event: `You could prioritize premium customers (faster support, priority delivery) for an extra fee.`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Keep service uniform',
          effects: { userSatisfaction: 2, platformProfit: -40, activeUsers: 60, competitivePressure: -1 },
          feedback: 'Uniform service feels fair and helps satisfaction, but monetization is slower.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Introduce priority tiers',
          effects: { platformProfit: 320, activeUsers: -60, userSatisfaction: -4, competitivePressure: 2 },
          feedback: 'You monetized willingness-to-pay, but some students dislike two-tier service.',
        },
      ],
      aiExplanation: 'Price discrimination can raise profit, but it can also reduce perceived fairness and satisfaction.',
    },
    {
      id: 'r2_card4_delivery_fee',
      event: `You consider a small delivery fee to improve unit economics.`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Avoid delivery fee',
          effects: { activeUsers: 40, userSatisfaction: 1, platformProfit: 0 },
          feedback: 'You kept demand strong, but unit economics remain thin.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Add delivery fee',
          effects: { platformProfit: 260, activeUsers: -110, userSatisfaction: -3, competitivePressure: 1 },
          feedback: 'Profits improved, but some price-sensitive users reduced orders.',
        },
      ],
      aiExplanation: 'Small fees can have big effects when users are price-sensitive or when competitors are close substitutes.',
    },
    {
      id: 'r2_card5_restaurant_support',
      event: `Restaurants complain about tablet glitches and slow payouts.\nDo you add a restaurant support team?`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Don’t add support (save costs)',
          effects: { platformProfit: 120, partnerRestaurants: -1, competitivePressure: 3, userSatisfaction: -2 },
          feedback: 'Costs stayed low, but supplier churn picked up.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Add restaurant support',
          effects: { platformProfit: -140, partnerRestaurants: 2, competitivePressure: -2, userSatisfaction: 1 },
          feedback: 'Better supplier experience strengthens the supply side and reduces churn.',
        },
      ],
      aiExplanation: 'Platforms must balance both sides: supplier satisfaction influences variety and user demand.',
    },
    {
      id: 'r2_summary',
      event: `End of Round 2\n\nPricing power is emerging. Review the consequences before facing competition.`,
      decisions: [{ id: 'continue', text: 'Continue', effects: {} }],
    },

    // ROUND 3 — COMPETITION & DIFFERENTIATION
    {
      id: 'r3_card0_competitor_enters',
      event: `ROUND 3 — COMPETITION & DIFFERENTIATION\n\nExternal shock: a competing delivery app enters the campus market.`,
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
      id: 'r3_card1_compete_on_price',
      event: `Compete on price?\nLower commissions and delivery fees to undercut competitors.`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Avoid a price war',
          effects: { platformProfit: 160, activeUsers: -120, userSatisfaction: -2, competitivePressure: 4 },
          feedback: 'You stayed profitable, but you conceded some market share.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Cut prices to undercut',
          effects: { averageCommissionPct: -2.0, platformProfit: -420, activeUsers: 240, userSatisfaction: 4, competitivePressure: -5 },
          feedback: 'Users liked the price cut, but profits fell sharply. Price wars are costly.',
        },
      ],
      aiExplanation: 'In monopolistic competition, price wars are tempting but often unsustainable.',
    },
    {
      id: 'r3_card2_differentiate',
      event: `Differentiate instead?\nFocus on late-night delivery and exclusive student favorites.`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Stay generic',
          effects: { userSatisfaction: -5, activeUsers: -60, competitivePressure: 5, platformProfit: 40 },
          feedback: 'You became easier to substitute for rivals.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Build a niche (late-night + exclusives)',
          effects: { userSatisfaction: 12, activeUsers: 180, partnerRestaurants: 2, competitivePressure: -7, platformProfit: 140 },
          feedback: 'You built loyalty. Differentiation reduces direct price competition.',
        },
      ],
      aiExplanation: 'Differentiation can create pricing power by making your product less substitutable.',
    },
    {
      id: 'r3_card3_app_experience',
      event: `Your app is clunky compared to the entrant.\nDo you invest in UX improvements?`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Don’t invest (save cash)',
          effects: { platformProfit: 120, userSatisfaction: -6, competitivePressure: 4 },
          feedback: 'You saved cash, but the product feels worse than rivals.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Improve the app experience',
          effects: { platformProfit: -180, userSatisfaction: 8, activeUsers: 120, competitivePressure: -2 },
          feedback: 'A better product reduces churn and improves long-run demand.',
        },
      ],
      aiExplanation: 'Non-price competition (quality) is a key strategy in monopolistic competition.',
    },
    {
      id: 'r3_card4_campus_partnership',
      event: `A student union offers to promote your app if you sponsor campus events.`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Decline sponsorship',
          effects: { platformProfit: 60, activeUsers: 0, competitivePressure: 2 },
          feedback: 'You conserved cash, but missed a branding opportunity.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Sponsor events + partner',
          effects: { platformProfit: -120, activeUsers: 160, userSatisfaction: 4, competitivePressure: -2 },
          feedback: 'Brand partnerships can create loyalty and reduce effective competition.',
        },
      ],
      aiExplanation: 'Branding and partnerships shift preferences—another form of differentiation.',
    },
    {
      id: 'r3_card5_restore_margins',
      event: `To restore margins, you consider nudging commissions upward slightly (without announcing it loudly).`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Keep pricing stable',
          effects: { platformProfit: 80, competitivePressure: -1, partnerRestaurants: 0 },
          feedback: 'Stability helps retain suppliers, but profits recover slowly.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Nudge commissions up',
          effects: { averageCommissionPct: 1.5, platformProfit: 220, partnerRestaurants: -1, competitivePressure: 2, userSatisfaction: -1 },
          feedback: 'Profits improved, but some suppliers noticed and started exploring alternatives.',
        },
      ],
      aiExplanation: 'After competition arrives, your ability to raise prices becomes more constrained.',
    },
    {
      id: 'r3_summary',
      event: `End of Round 3\n\nCompetition changed the game. Review how your choices affected loyalty, profit, and pressure.`,
      decisions: [{ id: 'continue', text: 'Continue', effects: {} }],
    },

    // ROUND 4 — MARKET POWER TEST
    {
      id: 'r4_card1_exclusive_contracts',
      event: `ROUND 4 — MARKET POWER TEST\n\nOffer exclusive contracts to top restaurants?`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Keep the market open',
          effects: { userSatisfaction: 3, competitivePressure: 6, platformProfit: 40, partnerRestaurants: 1 },
          feedback: 'Flexibility increased variety, but it also gave rivals easier access to the same suppliers.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Offer exclusivity',
          effects: { competitivePressure: -10, platformProfit: 420, userSatisfaction: -3, partnerRestaurants: 1 },
          feedback: 'Exclusivity raised barriers to entry, but some users dislike reduced choice.',
        },
      ],
      aiExplanation: 'Exclusive contracts can create barriers to entry, but they may reduce consumer surplus (satisfaction).',
    },
    {
      id: 'r4_card2_surge_pricing',
      event: `Introduce surge pricing during peak hours?`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Avoid surge pricing',
          effects: { userSatisfaction: 2, platformProfit: 0, competitivePressure: 2 },
          feedback: 'Satisfaction stayed higher, but you left peak-hour profits unrealized.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Add surge pricing',
          effects: { platformProfit: 520, userSatisfaction: -10, activeUsers: -70, competitivePressure: 4 },
          feedback: 'Profits rose, but dissatisfaction increased. Some users reduced orders or tried competitors.',
        },
      ],
      aiExplanation: 'Market power enables price increases, but backlash can reduce long-run demand and loyalty.',
    },
    {
      id: 'r4_card3_expand_zone',
      event: `Expand to a nearby campus housing zone (more users, more operational complexity).`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Stay focused on core campus',
          effects: { platformProfit: 120, activeUsers: 40, competitivePressure: 2 },
          feedback: 'You stayed focused, but growth opportunities were limited.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Expand coverage area',
          effects: { activeUsers: 260, partnerRestaurants: 3, platformProfit: 140, userSatisfaction: -2, competitivePressure: 5 },
          feedback: 'Expansion increased scale, but service complexity increased and competitors noticed the move.',
        },
      ],
      aiExplanation: 'Scale can help profits, but it can also increase competitive attention and operational strain.',
    },
    {
      id: 'r4_card4_cut_top_restaurant_commissions',
      event: `Top restaurants demand a lower commission or they will multi-home on the rival app.`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Refuse (hold the line)',
          effects: { platformProfit: 180, partnerRestaurants: -2, activeUsers: -90, userSatisfaction: -3, competitivePressure: 6 },
          feedback: 'You defended margins, but losing key suppliers weakened the network.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Give them a commission cut',
          effects: { averageCommissionPct: -1.5, platformProfit: -120, partnerRestaurants: 1, userSatisfaction: 2, competitivePressure: -2 },
          feedback: 'You protected variety and demand, but at the cost of lower take-rate.',
        },
      ],
      aiExplanation: 'When suppliers have outside options, your pricing power is constrained—even if you’re large.',
    },
    {
      id: 'r4_card5_acquire_competitor',
      event: `You consider acquiring the rival app’s campus operations.\nIt’s expensive, but could reduce pressure quickly.`,
      decisions: [
        {
          id: 'reject',
          text: 'Swipe left: Don’t acquire (too costly)',
          effects: { platformProfit: 120, competitivePressure: 8, activeUsers: -40 },
          feedback: 'You kept cash, but rivalry continued.',
        },
        {
          id: 'accept',
          text: 'Swipe right: Acquire competitor',
          effects: { platformProfit: -900, competitivePressure: -25, activeUsers: 280, userSatisfaction: -2 },
          feedback: 'Pressure dropped sharply, but the acquisition hit profits. Integration risk remains.',
        },
      ],
      aiExplanation: 'Reducing competition can raise market power, but mergers can be costly and may harm consumers.',
    },
    {
      id: 'r4_summary',
      event: `Final Summary\n\nMarket power was tested. Review your final outcomes.`,
      decisions: [{ id: 'continue', text: 'View Results', effects: {} }],
    },
  ],
};

