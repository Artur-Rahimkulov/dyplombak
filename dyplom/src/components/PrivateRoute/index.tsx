import { Navigate, Outlet, Route } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../../store/auth.store";

const PrivateRoute = ({ child }: { child: JSX.Element }) => {

  if (authStore.isLoadingAuth) {
    return <div>Checking auth...</div>;
  }
  if (authStore.isAuth) {
    if (child)
      return child
    return <Outlet />
  } else {

    return <Navigate to="/login" />;
  }
};

export default observer(PrivateRoute);