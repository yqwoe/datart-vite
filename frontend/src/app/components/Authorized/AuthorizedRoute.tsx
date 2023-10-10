import { Navigate, NavigateProps, Route, RouteProps } from 'react-router-dom';
import { Authorized } from './Authorized';

interface AuthorizedRouteProps {
  authority: boolean;
  routeProps: RouteProps;
  redirectProps: NavigateProps;
}

export function AuthorizedRoute({
  authority,
  routeProps,
  redirectProps,
}: AuthorizedRouteProps) {
  return (
    <Authorized authority={authority} denied={<Navigate {...redirectProps} />}>
      <Route {...routeProps} />
    </Authorized>
  );
}
