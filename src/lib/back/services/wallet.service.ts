import { walletRepository } from "../repositories/wallet.repo";

export const walletService = {
  getAll: walletRepository.getAll,
};
