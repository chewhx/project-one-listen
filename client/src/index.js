import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
import Auth0ProviderWithHistory from "./auth/Auth0Provider";
import GlobalProvider from "./providers/GlobalProvider";

const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Router>
      <Auth0ProviderWithHistory>
        <GlobalProvider>
          <App />
        </GlobalProvider>
      </Auth0ProviderWithHistory>
    </Router>
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  </QueryClientProvider>,
  document.querySelector("#root")
);
