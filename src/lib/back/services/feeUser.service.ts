import { feeUserRepository } from "../repositories/feeUser.repo";

export const feeUserService = {
  create: feeUserRepository.create,

  getAll: feeUserRepository.getAll,

  deleteById: feeUserRepository.deleteById,

  active: async (id: string) => {
    try {
      await feeUserRepository.setActive(id);
      await feeUserRepository.setInactiveOthers(id);

      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  },
};
