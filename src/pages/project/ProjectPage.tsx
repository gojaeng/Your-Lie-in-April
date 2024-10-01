import ProjectFormLayout from '@components/layout/ProjectFormLayout';
import useAllMemberInfoQuery from '@hooks/apis/queries/member/useAllMemberInfoQuery';
import { DateProvider } from '@hooks/context/dateContext';
import { ProjectProvider } from '@hooks/context/projectContext';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Layout from '@pages/layouts/Layout';
import { useAppDispatch, useAppSelector } from '@redux/config/hook';
import { RootState } from '@redux/config/store';
import { setIsEdit } from '@redux/reducers/mode';
import { isMobileSetHeight } from '@utils/isMobileSetHeight';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Alarm from './components/alarm/Alarm';
import ScheduleCalendar from './components/calendar/ScheduleCalendar';
import ProjectInfoDetail from './components/info/ProjectInfoDetail';
import ProfileList from './components/profiles/ProfileList';
import MemberScheduleGrid from './components/schedules/member/MemberScheduleGrid';
import MySchedule from './components/schedules/my/MySchedule';
import TeamSchedule from './components/schedules/team/TeamSchedule';

const ProjectPage: React.FC = () => {
    const [seeMemTime, setSeeMemTime] = useState(true);
    const [isEditModal, setIsEditModal] = useState(false);

    const toggleMemTime = () => {
        setSeeMemTime(!seeMemTime);
    };

    const { projectId } = useParams();
    const { data: membersData } = useAllMemberInfoQuery(Number(projectId));

    isMobileSetHeight();

    const dispatch = useAppDispatch();
    const { isEdit } = useAppSelector((state: RootState) => state.mode);

    const location = useLocation();

    useEffect(() => {
        dispatch(setIsEdit(false));
    }, [location, dispatch]);
    return (
        <ProjectProvider>
            <DateProvider>
                {isEdit ? (
                    <ProjectFormLayout />
                ) : (
                    <>
                        <GlobalStyle />
                        <Layout>
                            <Divider />
                            <ProjectInfoDetail />
                            <Box>
                                <OuterColumn>
                                    <MainBox>
                                        <ProfileList />
                                        <InnerColumn>
                                            <TeamSchedule />
                                            <MySchedule
                                                isEditModal={isEditModal}
                                                setIsEditModal={setIsEditModal}
                                            />
                                        </InnerColumn>
                                        <InnerColumn>
                                            <ScheduleCalendar />
                                            <Alarm />
                                        </InnerColumn>
                                    </MainBox>
                                    {membersData && membersData.length > 1 && (
                                        <>
                                            <MemTimeBtn onClick={toggleMemTime}>
                                                {seeMemTime
                                                    ? '멤버 시간표 닫기'
                                                    : '멤버 시간표 열기'}
                                                {seeMemTime ? (
                                                    <ArrowDropUpIcon className='icon' />
                                                ) : (
                                                    <ArrowDropDownIcon className='icon' />
                                                )}
                                            </MemTimeBtn>
                                            {seeMemTime && <MemberScheduleGrid />}
                                        </>
                                    )}
                                </OuterColumn>
                            </Box>
                            <div style={{ height: '400px' }} />
                        </Layout>
                    </>
                )}
            </DateProvider>
        </ProjectProvider>
    );
};
export default ProjectPage;

const GlobalStyle = createGlobalStyle`
  body {
    width : 100%;
    min-width : 1366px;
    margin: 0;
    background-color: #FFFFFF;
    -ms-overflow-style: none;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

const Divider = styled.div`
    width: 100%;
    height: 20px;
    background-color: #212121;
`;

const Box = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    box-sizing: border-box;
    margin-top: 32px;
`;

const OuterColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
`;

const InnerColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const MainBox = styled.div`
    display: flex;
    gap: 22px;
`;

const MemTimeBtn = styled.button`
    width: 176px;
    height: 40px;
    display: flex;
    padding: 0;
    align-items: center;
    justify-content: center;
    gap: 2px;
    border-radius: 30px;
    background: #212121;
    color: #ffffff;
    font-family: 'Pretendard';
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    .icon {
        width: 22px;
        height: 22px;
    }
`;
