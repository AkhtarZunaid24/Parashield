/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export interface CoverageFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PartnerLogo {
  id: string;
  name: string;
  url: string;
}

export enum Section {
  HERO = 'hero',
  FEATURES = 'features',
  TRUST = 'trust',
  FOOTER = 'footer',
}
