import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
import AuthProvider from "./providers/AuthProvider";

const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Router>
        <App />
      </Router>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </AuthProvider>
  </QueryClientProvider>,
  document.querySelector("#root")
);
