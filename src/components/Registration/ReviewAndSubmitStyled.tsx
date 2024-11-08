import styled from 'styled-components';

const ReviewContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  
  h2 {
    text-align: center;
    color: #333;
  }

  .section {
    margin-bottom: 20px;
    padding: 10px;
    border-bottom: 1px solid #ddd;

    h3 {
      color: #444;
      margin-bottom: 10px;
    }

    p {
      margin: 5px 0;
      color: #555;
    }

    h4 {
      margin-top: 10px;
      color: #666;
      font-size: 0.9em;
    }
  }

  .submit-button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;

    &:hover {
      background-color: #45a049;
    }
  }

  @media only screen and (max-width: 425px) {
    padding: 10px;

    h2 {
      font-size: 1.2em;
    }

    .section {
      padding: 5px;

      h3 {
        font-size: 1em;
      }

      p, h4 {
        font-size: 0.9em;
      }
    }

    .submit-button {
      padding: 8px;
      font-size: 14px;
    }
  }
`;

export default ReviewContainer;
