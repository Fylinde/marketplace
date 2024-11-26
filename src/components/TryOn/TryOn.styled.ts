import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    margin: 20px auto;
`;

export const Loader = styled.div`
    font-size: 1.5rem;
    color: #007bff;
`;

export const ErrorMessage = styled.div`
    font-size: 1.2rem;
    color: red;
    margin-top: 10px;
`;

