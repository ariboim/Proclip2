import { AgentProfile, TokenState } from '../types/property';
import { DEFAULT_AGENT_PROFILE, createPresetAgencyLogo } from './sampleData';

const AGENT_PROFILE_KEY = 'properticlip_agent_profile';
const TOKEN_STATE_KEY = 'properticlip_token_state';
const RECENT_PROJECTS_KEY = 'properticlip_recent_projects';

export function getStoredAgentProfile(): AgentProfile {
  if (typeof window === 'undefined') return DEFAULT_AGENT_PROFILE;
  try {
    const raw = localStorage.getItem(AGENT_PROFILE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load profile', e);
  }
  // Default with generated logo
  const defaultProfile = { ...DEFAULT_AGENT_PROFILE };
  if (!defaultProfile.agencyLogoUrl && typeof document !== 'undefined') {
    defaultProfile.agencyLogoUrl = createPresetAgencyLogo('Brighton', '#f59e0b');
  }
  return defaultProfile;
}

export function saveAgentProfile(profile: AgentProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AGENT_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getStoredTokenState(): TokenState {
  const defaultState: TokenState = {
    remainingTokens: 5, // 5 Free Demo Tokens as requested
    totalUsed: 0,
    isUnlimitedVip: false,
  };
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = localStorage.getItem(TOKEN_STATE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load token state', e);
  }
  return defaultState;
}

export function saveTokenState(state: TokenState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save token state', e);
  }
}

export function useOneToken(): { success: boolean; state: TokenState } {
  const state = getStoredTokenState();
  if (state.isUnlimitedVip) {
    state.totalUsed += 1;
    saveTokenState(state);
    return { success: true, state };
  }
  if (state.remainingTokens <= 0) {
    return { success: false, state };
  }
  state.remainingTokens -= 1;
  state.totalUsed += 1;
  saveTokenState(state);
  return { success: true, state };
}

export function activateUnlimitedVip(): TokenState {
  const state = getStoredTokenState();
  state.isUnlimitedVip = true;
  state.remainingTokens = 9999;
  saveTokenState(state);
  return state;
}

export function addDemoTokens(amount: number = 5): TokenState {
  const state = getStoredTokenState();
  state.remainingTokens += amount;
  saveTokenState(state);
  return state;
}
