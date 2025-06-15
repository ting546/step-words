import { AppProvider } from "../context/context";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import Header from "../components/Header";
import QueryProvider from "../components/QueryProvider";
import AllLayout from "../layouts/all";
import { Toaster } from "react-hot-toast";

const RootLayout = async ({ children }) => {
 
  return (
    <AppProvider>
      <AllLayout>
        <QueryProvider>
          <Header />
          <NextTopLoader />
          <Toaster position="right-top" gutter={4} />
          <main>{children}</main>
          <footer></footer>
        </QueryProvider>
      </AllLayout>
    </AppProvider>
  );
};
export default RootLayout;
