import { BadRequestException } from '@nestjs/common';
import { searchCatalog } from '../repositories/search.repository';
import { getDocumentsByIds } from '../../documents/repositories/document.repository';
import { getCategoriesByIds } from '../../catalogs/categories/repositories/category.repository';
import { Search } from '../entities/search.entity';
import { Document } from '../../documents/entities/document.entity';
import { Category } from '../../catalogs/categories/entities/category';
import { getS3Instant } from '../../documents/services/document.service';
import { TEN_MINUTES } from '../../../common/constants/timeUnits';

export const search = async (
  searchValue: string,
): Promise<
  Array<
    Omit<Search, 'coverImageId' | 'typeId'> & {
      coverImage: { url: string } & Document;
      type: Category;
    }
  >
> => {
  if (!searchValue) {
    throw new BadRequestException('Search param is required ?q=');
  }
  const searchResult = await searchCatalog(searchValue);

  const coverImageIds = searchResult.map((search) => search.coverImageId);
  const typeIds = searchResult.map((search) => search.typeId);

  const [coverImages, types] = await Promise.all([getDocumentsByIds(coverImageIds), getCategoriesByIds(typeIds)]);

  const mappedSearchResult = await Promise.all(
    searchResult.map(async ({ coverImageId, typeId, ...rest }) => {
      const coverImage = coverImages.find((image) => image.id === coverImageId);
      return {
        ...rest,
        coverImage: {
          ...coverImage,
          url: await getS3Instant().getObjectPresignedUrl(coverImage.key, TEN_MINUTES),
        },
        type: types.find((type) => type.id === typeId),
      };
    }),
  );

  return mappedSearchResult;
};
