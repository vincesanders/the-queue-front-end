import React from 'react';
import styled from 'styled-components';
import { Spinner} from 'reactstrap';

export default () => {
    const styles = {
        width: '280px',
        height: '280px'
    }
    const handleClick = e => {
        e.stopPropahation();
    }
    return (
        <Container onClick={handleClick}>
            <Spinner style={styles} color="info" />
        </Container>
    );
}

const Container = styled.div`
    background-color: #edf9fc;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    height: 100vh;
    width: 100%;
    overflow: hidden;
`