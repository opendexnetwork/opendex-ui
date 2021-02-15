import styled from "styled-components";

export const Left = styled.span`
  flex: 0 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
`;

export const Right = styled.span`
  flex: 1 0 auto;
  overflow: hidden;
  white-space: pre;
  max-width: 40px;
`;