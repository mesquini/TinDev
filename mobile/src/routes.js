import { createAppContainer, createSwitchNavigator } from "react-navigation";

import login from "./pages/login";
import main from "./pages/main";
import perfil from "./pages/perfil";

export default createAppContainer( createSwitchNavigator({
  login,
  main,
  perfil
}));
