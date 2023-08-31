export enum UserRole {
  ADMIN = 'admin',
  OFFICER = 'officer',
  AGENT = 'agent',
}

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export type CreateUserType = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  alternatePhone?: string;
  role: UserRole;
  profileImage?: string;
  gender: GenderEnum;
  locations: UserLocationType[];
};

export type UserLocationType = {
  regionId: string;
  districtId: string;
};

export enum SubscriberTypes {
  INDIVIDUAL = 'individual',
  INSTITUTIONAL = 'institutional',
}

export enum AdministratorTypes {
  SUPERADMIN = 'super-administrator',
  ADMIN = 'administrator',
  MANAGER = 'manager',
  PUBLISHER = 'publisher',
}
