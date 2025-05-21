import { walletRepository } from "../repositories/wallet.repo";

export const walletService = {
  getAll: () => {
    return walletRepository.getAll();
  },

  getUserWallets: (userId: string) => {
    return walletRepository.findByUserId(userId);
  },
};
