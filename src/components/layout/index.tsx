import React from "react";
import Header from "../header";
import * as S from "./styled";

interface ILayoutProps {
  children?: any;
}

const Layout = ( { children  }: ILayoutProps) => {
  return (
    <S.WrapperLayout>
      <Header />
      {children}
    </S.WrapperLayout>
  );
};

export default Layout;
