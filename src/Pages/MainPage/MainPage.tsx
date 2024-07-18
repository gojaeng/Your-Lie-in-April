import useProjectMainQuery from '@hooks/apis/queries/project/useProjectMainQuery';
import { useMainPaginationMutation } from '@hooks/useMainPaginationMutation';
import AfterLogin from '@Pages/layouts/AfterLogin';
import BeforeLogin from '@Pages/layouts/BeforeLogin';
import Search from '@Pages/layouts/Search';

import { ProjectThumbnailResponse } from '@/types/projectType';
import { memberId } from '@utils/token';
import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Banner from './components/Banner';
import Pinned from './components/pinned/Pinned';
import Profile from './components/Profile';
import NewProject from './components/projects/NewProject';
import Pagination from './components/projects/Pagination';
import ProjectList from './components/projects/ProjectList';
import Alarm from './components/Alarm';

const GlobalStyle = createGlobalStyle`
  body {
    width : 100%;
    min-width : 1366px;
    margin: 0 auto;
    background-color: #212121;
    -ms-overflow-style: none;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

const MainContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-width: 1284px;
    box-sizing: border-box;
`;

function useQuery() {
    const location = useLocation();
    return new URLSearchParams(location.search);
}

const MainPage: FC = () => {
    const query = useQuery();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<ProjectThumbnailResponse[]>([]);

    useEffect(() => {
        const accessToken = query.get('access_token') || localStorage.getItem('access_token');
        const refreshToken = query.get('refresh_token') || localStorage.getItem('refresh_token');
        const memberId = query.get('member_id') || localStorage.getItem('member_id');

        if (accessToken) localStorage.setItem('access_token', accessToken);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
        if (memberId) localStorage.setItem('member_id', memberId);

        if (accessToken && refreshToken) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const { currentPage, totalPages, projects, handlePageChange, updatePaginationData } =
        useMainPaginationMutation(memberId);
    const { data: getProjectMainPagination } = useProjectMainQuery(memberId, currentPage, 6);
    useEffect(() => {
        if (getProjectMainPagination) {
            updatePaginationData(getProjectMainPagination);
            setSearchResults(getProjectMainPagination.data);
        }
    }, [getProjectMainPagination]);

    const handleSearch = (query: string) => {
        const searchProjects = projects.filter((project) =>
            project.title.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(searchProjects);
    };

    return (
        <>
            <GlobalStyle />
            {isLoggedIn ? <AfterLogin /> : <BeforeLogin />}
            <Banner />
            <div
                style={{
                    height: '126px',
                }}
            />
            <MainContainer>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '14px',
                        }}
                    >
                        <Profile />
                        <Alarm />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '24px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: '21px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    gap: '8px',
                                }}
                            >
                                <Search onSearch={handleSearch} />
                                <NewProject />
                            </div>
                            <Pinned />
                        </div>
                        <ProjectList projects={searchResults} />
                        {isLoggedIn && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </MainContainer>
            <div style={{ height: '300px' }} />
        </>
    );
};

export default MainPage;
