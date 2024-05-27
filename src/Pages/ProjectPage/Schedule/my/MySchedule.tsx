import styled from 'styled-components';
import EditMySchedule from './EditMySchedule';
import MyTime from './MyTime';
import { useContext, useEffect, useState } from 'react';
import { useUserContext } from '#/Pages/MainPage/MainPage';
import { DateContext } from '#/hooks/context/dateContext';
import dayjs from 'dayjs';
import { Http } from '#/constants/backendURL';
import { ScheduleWeekResponse } from '#/Types/scheduletype';
import { useParams } from 'react-router-dom';

const Box = styled.div`
    width: 661px;
    height: 294px;
    border-radius: 20px;
    border: 1px solid #000000;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 5px 5px 8px 3px;
    justify-content: space-between;
`;

const CommonText = styled.div`
    color: #000000;
    text-align: center;
    font-family: Pretendard;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const Title = styled(CommonText)`
    width: 430px;
    height: 20px;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 700;

    flex-basis: 80%;
`;

const EditBtn = styled.button`
    width: 51px;
    padding: 4px 8px;
    box-sizing: border-box;
    justify-content: flex-end;
    align-items: center;
    border-radius: 15px;
    background: #633ae2;

    color: #ffffff;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    white-space: nowrap;
`;

const MySchedule = () => {
    const [isEditModal, setIsEditModal] = useState(false);

    const onSetIsEditModal = () => {
        setIsEditModal((prev) => !prev);
    };

    // 유저데이터가져옴
    const { userData } = useUserContext();
    const memberId = userData?.memberId;

    // 프로젝트 ID 가져옴
    const { projectId } = useParams();
    console.log(`myTime projectId: ${projectId}`);

    // 달력 선택 날짜 가져옴
    const date = useContext(DateContext);
    const condition = dayjs(date?.selectedDate).format('YYYY-MM-DD') ?? '';
    console.log(`condition : ${condition}`);

    const [scheduleData, setSchdeuleData] =
        useState<ScheduleWeekResponse | null>(null);
    // 스케줄 데이터 가져옴
    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        const memberId = localStorage.getItem('member_id');
        const fetchSchedule = async () => {
            try {
                const response = await fetch(
                    `${Http}/v1/projects/${projectId}/members/${memberId}/schedules?condition=${condition}`,
                    {
                        method: 'GET',
                        headers: {
                            Accept: '*/*',
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch pinned projects');
                }

                const data = await response.json();
                console.log('내 스케줄', data.data);
                setSchdeuleData(data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchSchedule();
    }, [projectId, memberId, condition]);

    return (
        <>
            <Box>
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                    }}
                >
                    <div
                        style={{
                            justifyContent: 'flex-start',
                            flexBasis: '10%',
                        }}
                    />
                    <Title>나의 시간표</Title>
                    <EditBtn onClick={onSetIsEditModal}>수정하기</EditBtn>
                    <div
                        style={{ justifyContent: 'flex-end', flexBasis: '1%' }}
                    />
                </div>
                <MyTime scheduleData={scheduleData} />
            </Box>
            {isEditModal && (
                <EditMySchedule
                    onSetIsEditModal={onSetIsEditModal}
                    scheduleData={scheduleData}
                />
            )}
        </>
    );
};

export default MySchedule;
