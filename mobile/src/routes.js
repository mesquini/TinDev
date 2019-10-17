import { createAppContainer, createSwitchNavigator } from "react-navigation";

import Login from "./pages/login";
import Dashboard from "./pages/main";

const mainNavigation = createSwitchNavigator({
  Login,
  Dashboard
});

export default createAppContainer(mainNavigation);
