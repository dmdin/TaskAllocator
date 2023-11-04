enum ConnectionDate { Yesterday, LongAgo };


interface IBranchModel {
    id: string | undefined;
    address: string;
    connectionDate: ConnectionDate,
    cardMaterialsDelivered: boolean,
    lastCardIssuanceDays: number,
    approvedIssuesNumber: number,
    issuanceCardCount: number
}