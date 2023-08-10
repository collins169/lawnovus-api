import { getEntityRepository } from '../../../database/getEntityRepository';
import { ContactDetail } from '../entities/contact-detail.entity';

export const getContactDetailRepository = async () => {
  return await getEntityRepository(ContactDetail);
};

export const isEmailExsiting = async (email: string) => {
  const contactRepository = await getContactDetailRepository();
  const contact = await contactRepository.findOne({
    where: {
      email,
    },
  });
  return !!contact;
};

export const isPhoneNumberExsiting = async (phone: string) => {
  const contactRepository = await getContactDetailRepository();
  const contact = await contactRepository.findOne({
    where: {
      phone,
    },
  });
  return !!contact;
};
