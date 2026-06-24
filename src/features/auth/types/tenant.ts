export interface TenantListItemDto {
  id: string; // GUID
  companyName: string;
  companyCode: string;
  roleName: string; // The role the user has in THIS specific tenant
}
