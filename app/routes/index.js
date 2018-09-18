import { createStackNavigator } from "react-navigation";
import ProductListContainer from "../modules/products/containers/ProductListContainer";
import LoginContainer from "../modules/login/containers/LoginContainer";
export default createStackNavigator({
	Login:{
    screen : LoginContainer,
    navigationOptions: {
     header: null ,
    }
  },
  Home:{
    screen : ProductListContainer,
    navigationOptions: {
     header: null ,
    }
  }
});
