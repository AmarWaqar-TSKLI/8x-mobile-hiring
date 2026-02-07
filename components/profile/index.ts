/**
 * Profile components — barrel export
 */
export { C, SW, SH, PROFILE, PORTFOLIO, ACHIEVEMENTS, BRAND_PARTNERS, ANALYTICS, EARNINGS, SETTINGS } from './constants';
export { formatCompact, tierColor, tierBg } from './constants';
export type { ProfileData, PortfolioItem, Achievement, BrandPartner, AnalyticsSnapshot, SettingItem } from './constants';

export { ProfileHeader }    from './profile-header';
export { ErrorProfile }     from './error-state';
export { ProfileStats }     from './profile-stats';
export { PortfolioGrid }    from './portfolio-grid';
export { AchievementRow }   from './achievement-row';
export { EarningsCard }     from './earnings-card';
export { BrandConnections } from './brand-connections';
export { SettingsSection }  from './settings-section';
