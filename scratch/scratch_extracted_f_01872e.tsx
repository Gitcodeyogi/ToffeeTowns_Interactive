import React, { useState, useEffect, useRef } from 'react';
import { FONT, FLASH_NEWS_DATA } from '../lib/uiConstants';
import { useTTStore } from '../store/useTTStore';
import { cozyAudio } from '../utils/audioHelper';

const HARSH_WORDS = [
  'fuck', 'shit', 'damn', 'bitch', 'bastard', 'hate', 'stupid', 'jerk',
  'fool', 'idiot', 'asshole', 'crap', 'dick', 'suck', 'useless', 'worst',
  'garbage', 'trash', 'horrible', 'shut up', 'kill', 'die', 'dumb', 'rubbish', 'wrongly'
];

interface Message {
  sender: 'player' | 'npc' | 'system';
  text: string;
  time: string;
}

interface CharacterTalk {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  greeting: string;
  lovedItems: string[];
  dislikedItems: string[];
  loveReaction: string;
  normalReaction: string;
  responses: {
    secret: string[];
    joke: string[];
    chore: string[];
    default: string[];
  };
  keywords: { keys: string[]; replies: string[] }[];
}

interface CallingCardRequest {
  request: string;
  opt1Label: string;
  opt1Reply: string;
  opt1RewardCoins?: number;
  opt1RewardLegacy?: number;
  opt1RewardXPCat?: string;
  opt1RewardXPVal?: number;
  opt2Label: string;
  opt2Reply: string;
  opt2CostKey?: string;
  opt2CostVal?: number;
  opt2RewardLegacy?: number;
}

const TALK_CHARACTERS: CharacterTalk[] = [
  {
    id: 'goldwhistle',
    name: 'Sir Goldwhistle',
    role: 'Tax Auditor',
    avatar: '/Characters/Char Cards/Nico_Whistle.png',
    color: 'from-yellow-500 to-amber-600',
    lovedItems: ['parchment'],
    dislikedItems: ['mucus'],
    loveReaction: \