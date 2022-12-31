import styled from "styled-components";

export const Container = styled.div`
  width: 70%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 0.3fr;
  flex-direction: column;
`;

export const TableContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  #customers {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  #customers td {
    cursor: pointer;
  }

  #customers td, #customers th {
    border: 1px solid #ddd;
    padding: 8px;
  }

  #customers tr:nth-child(even){background-color: #f2f2f2;}

  #customers tr:hover {background-color: #ddd;}

  #customers th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #212121e8;
    color: white;
  }
`;

export const List = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h3`
  font-size: 1.5rem;
  text-align: center;
  margin: 2rem auto;
`;

export const CreateNewSession = styled.button`
  width: 100%;
  height: 2rem;
  margin-top: 2rem;
  border-radius: 8px;
  padding: 0.3rem;
  border: 1px solid #000;
`;

export const Button = styled.button`
  width: 100%;
  margin-top: 1rem;
  border-radius: 8px;
  padding: 0.3rem;
  border: 1px solid #000;
`;
