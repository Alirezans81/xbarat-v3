import { paymentChannelRepository } from "../repositories/paymentChannel.repo";

export const paymentChannelService = {
  create: paymentChannelRepository.create,

  getAll: paymentChannelRepository.getAll,

  getById: paymentChannelRepository.findById,

  updateById: paymentChannelRepository.updateById,

  deleteById: paymentChannelRepository.deleteById,
};
