import { bridgeTransferRepository } from "../repositories/bridgeTransfer.repo";

export const bridgeTransferService = {
  create: bridgeTransferRepository.create,

  createMany: bridgeTransferRepository.createMany,

  getAll: bridgeTransferRepository.getAll,

  getById: bridgeTransferRepository.findById,

  updateById: bridgeTransferRepository.updateById,

  deleteById: bridgeTransferRepository.deleteById,
};
