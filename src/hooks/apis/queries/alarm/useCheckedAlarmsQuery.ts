import { getAlarmAll, getAlarmProject } from '@apis/alarm';
import { QUERY_KEY } from '@constants/queryKey';
import { getCurrentTimestamp } from '@pages/main/components/alarm/getCurrentTimestamp';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const useCheckedAlarmsQuery = (projectId?: number) => {
    const [isCheckedComplete, setIsCheckedComplete] = useState<boolean>(false);

    const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: projectId
            ? (QUERY_KEY.ALARM_PROJECT(projectId, true) as [string, number, string, boolean])
            : (QUERY_KEY.ALARM_ALL(true) as [string, boolean]),
        queryFn: ({ pageParam = getCurrentTimestamp() }) =>
            projectId ? getAlarmProject(projectId, pageParam, true) : getAlarmAll(pageParam, true),
        getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
        initialPageParam: getCurrentTimestamp(),
    });

    useEffect(() => {
        if (data?.pages) {
            const lastPage = data.pages[data.pages.length - 1];
            if (lastPage && lastPage.hasMore === false) {
                setIsCheckedComplete(true);
            } else {
                setIsCheckedComplete(false);
            }
        }
    }, [data]);

    return {
        data,
        hasNextPage,
        fetchNextPage,
        isCheckedComplete,
    };
};

export default useCheckedAlarmsQuery;
