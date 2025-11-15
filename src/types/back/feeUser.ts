export type CreateFeeUser = {
  userId: string;
  isActive: boolean;
};

export type GetFeeUserFilters = {
  userId?: string;
  isActive?: boolean;
};

export type UpdateFeeUser = {
  isActive?: boolean;
};
