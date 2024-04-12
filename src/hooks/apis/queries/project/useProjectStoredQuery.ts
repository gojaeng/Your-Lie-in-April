import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '#/constants/queryKey';
import { getProjectIsStored } from '#/apis/project';

/**
 * GET /v1/projects/stored
 *
 * 보관한 프로젝트 목록을 조회하는 api 입니다.
 */

const useProjectStoredQuery = () => {
    return useQuery({
        queryKey: QUERY_KEY.PROJECT_STORED(),
        queryFn: () => getProjectIsStored(),
    });
};

export default useProjectStoredQuery;
