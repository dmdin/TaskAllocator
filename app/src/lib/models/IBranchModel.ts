import type { IAddressModel } from './IAddressModel';

export enum ConnectionDate {
  Yesterday,
  LongAgo
}

export interface IBranchModel {
  id: string | undefined;
  address: IAddressModel;
  connectionDate: ConnectionDate;
  cardMaterialsDelivered: boolean;
  lastCardIssuanceDays: number;
  approvedIssuesNumber: number;
  issuanceCardCount: number;
  is_office: boolean;
}
