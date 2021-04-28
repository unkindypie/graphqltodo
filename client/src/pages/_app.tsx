import {
  ChakraProvider,
  ColorModeOptions,
  ColorModeProvider,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";

import { Container } from "../components/Container";
import Header from "../components/Header";
import { CurrentUserProvider } from "../contexts/CurrentUserContext";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";

const colorModeConfig: ColorModeOptions = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider options={colorModeConfig}>
        <CurrentUserProvider>
          <Container>
            <Header />

            <Component {...pageProps} />
          </Container>
        </CurrentUserProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default withUrqlClient(createUrqlClient)(MyApp);
