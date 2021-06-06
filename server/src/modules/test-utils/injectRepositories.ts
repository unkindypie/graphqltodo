import {Container} from 'typedi';
import {ConnectionManager} from 'typeorm';

type GetRepository = (connectionName: string) => any;

interface InjectRepositoriesParams {
  getRepository?: GetRepository;
  getMongoRepository?: GetRepository;
  getTreeRepository?: GetRepository;
  getCustomRepository?: GetRepository;
}

const fallbackGetFunction = (entityType: any) => {
  console.warn(`No mock repository found for ${entityType}`);
};

export const injectRepositories = ({
  getRepository,
  getCustomRepository,
  getMongoRepository,
  getTreeRepository,
}: InjectRepositoriesParams) => {
  Container.set(ConnectionManager, {
    has: (connectionName: string) => true,
    get: (connectionName: string) => ({
      getRepository: getRepository ?? fallbackGetFunction,
      getMongoRepository: getMongoRepository ?? fallbackGetFunction,
      getTreeRepository: getTreeRepository ?? fallbackGetFunction,
      getCustomRepository: getCustomRepository ?? fallbackGetFunction,
    }),
  });
};
