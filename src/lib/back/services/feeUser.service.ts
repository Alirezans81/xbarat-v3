import { feeUserRepository } from "../repositories/feeUser.repo";

export const feeUserService = {
  create: feeUserRepository.create,

  getAll: feeUserRepository.getAll,

  deleteById: feeUserRepository.deleteById,

  active: feeUserRepository.active,
};
