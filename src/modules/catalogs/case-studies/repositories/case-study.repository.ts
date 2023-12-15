import { getEntityRepository } from '../../../../database/getEntityRepository';
import { CaseStudy } from '../entities/case-studies';

export const getCaseStudyRepository = async () => {
  return await getEntityRepository(CaseStudy);
};

export const saveCaseStudy = async (input: Omit<CaseStudy, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>) => {
  const repository = await getCaseStudyRepository();
  const caseStudyToInsert = repository.create({ ...input });
  return await repository.save(caseStudyToInsert);
};

export const getCaseStudyById = async (id: string) => {
  const repository = await getCaseStudyRepository();
  return await repository.findOne({
    where: {
      id,
    },
    relations: ['file', 'coverImage', 'type'],
  });
};

export const getCaseStudyByType = async (type: string) => {
  const repository = await getCaseStudyRepository();
  return await repository.findOne({
    where: {
      type: {
        id: type,
      },
    },
    order: {
      createdAt: 'DESC',
    },
    relations: ['file', 'coverImage', 'type'],
  });
};

export const getCaseStudies = async () => {
  const repository = await getCaseStudyRepository();
  return await repository.find({
    order: {
      createdAt: 'DESC',
    },
    relations: ['file', 'coverImage', 'type'],
  });
};

export const updateCaseStudy = async ({ old, input }: { input: Partial<CaseStudy>; old: CaseStudy }) => {
  const repository = await getCaseStudyRepository();
  const caseStudyToUpdate = repository.merge(old, input);
  return await repository.save(caseStudyToUpdate);
};

export const deleteCaseStudy = async (id: string | string[]) => {
  const repository = await getCaseStudyRepository();
  return await repository.softDelete(id);
};
