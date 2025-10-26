import { bridgeTransferRepository } from "../repositories/bridgeTransfer.repo";

export const bridgeTransferService = {
  create: bridgeTransferRepository.create,

  createMany: bridgeTransferRepository.createMany,

  getAll: bridgeTransferRepository.getAll,

  getById: bridgeTransferRepository.findById,

  updateById: bridgeTransferRepository.updateById,

  deleteById: bridgeTransferRepository.deleteById,

  userOwnsTheBridgeTransfer: async (
    userId: string,
    bridgeTransferId: string
  ) => {
    try {
      const foundBridgeTransfer = await bridgeTransferRepository.findById(
        bridgeTransferId
      );

      if (!foundBridgeTransfer) return false;

      if (!foundBridgeTransfer.liquidityPoolId) return false;

      if (foundBridgeTransfer.liquidityPool?.userId === userId) return true;
      return false;
    } catch (error) {
      console.error("[USER_OWNS_BRIDGE_TRANSFER]", error);
    }
  },
};
