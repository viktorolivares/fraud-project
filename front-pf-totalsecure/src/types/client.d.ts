export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  nationalIdType: string;
  nationalId: string;
  birthday?: string;
  calimacoUser?: number;
  mvtId?: number;
  calimacoStatus?: string;
}

export interface CreateClientDto {
  firstName: string;
  lastName: string;
  email?: string;
  nationalIdType: string;
  nationalId: string;
  birthday?: string;
  calimacoUser?: number;
  mvtId?: number;
  calimacoStatus?: string;
}

export interface UpdateClientDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  nationalIdType?: string;
  nationalId?: string;
  birthday?: string;
  calimacoUser?: number;
  mvtId?: number;
  calimacoStatus?: string;
}
