import { withdrawalRepository } from "../../repositories/wallet/withdrawal.repo";

export const withdrawalService = {
  create: withdrawalRepository.create,

  getAll: withdrawalRepository.getAll,

  getById: withdrawalRepository.findById,

  updateById: withdrawalRepository.updateById,

  deleteById: withdrawalRepository.deleteById,

  userOwnsTheWithdrawal: async (userId: string, withdrawalId: string) => {
    try {
      const foundWithdrawal = await withdrawalService.getById(withdrawalId);

      if (!foundWithdrawal) return false;

      if (foundWithdrawal.userId === userId) return true;
      return false;
    } catch (error) {
      console.error("[USER_OWNS_WITHDRAWAL]", error);
    }
  },
};
