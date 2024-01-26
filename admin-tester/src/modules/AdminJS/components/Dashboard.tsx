import { H1 } from '@adminjs/design-system';
import styled from 'styled-components';

// 
const Container = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Logo = styled('img')`
    max-width: 30rem;
`;

// 
export const Dashboard: React.FC = () => {
    return (
        <Container>
            <H1 color="red">Dashboard</H1>
            <Logo src="https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png"></Logo>
        </Container>
    );
};
export default Dashboard;
