import styled, { createGlobalStyle } from 'styled-components';
import AfterLogin from '../Layouts/AfterLogin';
import StorageProjectList from './StorageProjectList';
import GraphicIcons from './Icon/GraphicIcons';
import { useProjectStoredQuery } from '#/hooks/apis/queries/project/useProjectStoredQuery';

const GlobalStyle = createGlobalStyle`
body {
  width : 100%;
  min-width : 1366px;
  min-height : 1200px;
  margin: 0 auto;
  background-color: #212121;
  -ms-overflow-style: none;
}

  ::-webkit-scrollbar {
    display: none;
  }
`;

const Title = styled.div`
    color: #ffffff;
    text-align: center;
    font-size: 42px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const SearchField = styled.input`
    width: 785px;
    height: 69px;
    border-radius: 40px;
    background: #ffffff;
    color: #a4a4a4;
    font-size: 28px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    padding: 18px 28px;
    box-sizing: border-box;
    border: none;
    outline: none;
`;

const StoragePage = () => {
    // userProjectStoredQuery 의 반환이 객체이므로 -> 객체로 받음?
    const { data } = useProjectStoredQuery();

    console.log('data :', data);
    return (
        <>
            <GlobalStyle />
            {data && (
                <>
                    <GraphicIcons />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '130px',
                        }}
                    >
                        <AfterLogin />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '49px',
                                alignItems: 'center',

                                zIndex: '1',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '48px',
                                }}
                            >
                                <Title>프로젝트 보관함</Title>
                                <SearchField placeholder="프로젝트 검색" />
                            </div>
                            <StorageProjectList projects={data} />
                        </div>
                    </div>
                    <div style={{ width: '100vw', height: '172px' }}></div>
                </>
            )}
        </>
    );
};

export default StoragePage;
