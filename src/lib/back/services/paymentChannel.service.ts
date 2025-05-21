import { PaymentChannel } from "@/generated/prisma";
import { paymentChannelRepository } from "../repositories/paymentChannel.repo";

export const paymentChannelService = {
  getAll: () => {
    return paymentChannelRepository.getAll();
  },

  create: (data: { name: string; description?: string }) => {
    return paymentChannelRepository.create(data);
  },

  getById: (id: string) => {
    return paymentChannelRepository.findById(id);
  },

  updateById: (
    id: string,
    newValue: {
      name: string;
      description?: string;
    }
  ): Promise<PaymentChannel> => {
    return paymentChannelRepository.updateById(id, newValue);
  },

  deleteById: (id: string) => {
    return paymentChannelRepository.deleteById(id);
  },
};
