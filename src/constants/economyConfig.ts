/**
 * TOFFEE TOWNS — CENTRALIZED ECONOMY BALANCING CONFIGURATION
 * 
 * Centralizing these values allows us to rebalance the entire game economy
 * (wages, fares, ticket prices, yields, and starting balances) from a single place.
 */

export const ECONOMY_CONFIG = {
  // --- Starting Balance ---
  STARTING_COINS: 100,

  // --- Daily Allowances ---
  DAILY_ALLOWANCE: 5,                  // Standard citizen daily visit reward
  RESIDENT_DAILY_ALLOWANCE: 8,         // Golden Citizen Pass daily visit reward

  // --- Entertainment & Leisure ---
  THEATRE_EPISODE_COST: 50,            // Cost to unlock one theatre episode
  FESTIVAL_TICKET_COST: 20,            // Cost of a festival entry ticket

  // --- Transit Fares ---
  HORSE_WAGON_COST: 3,                 // Standard fare for Caramel Wagon
  MONORAIL_COST: 5,                    // Standard fare for Glass Monorail

  // --- Earnings & Career Limits ---
  MAX_JOB_REWARD: 15,                  // Hard cap for standard profession jobs (Bakery, Clinic, etc.)
  MARKET_MAX_REWARD: 10,               // Hard cap for market trades

  // --- Passive Business Ventures ---
  BUSINESS_YIELD_MIN: 3,               // Minimum coin yield per cycle for owned boutique
  BUSINESS_YIELD_MAX: 5,               // Maximum coin yield per cycle for owned boutique
};
