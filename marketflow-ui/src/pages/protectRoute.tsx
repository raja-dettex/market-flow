import { useAuth } from '@/utils/auth.utils'
import { Navigate, Outlet } from 'react-router-dom';

const protectRoute = () => {
    const {isAuthenticated, isLoading } = useAuth();
    console.log(isAuthenticated,isLoading);
    if(isLoading) { 
        return <div>Loading please wait...</div> 
    }
    //console.log(isAuthenticated)
    if(isAuthenticated === null) {
        return <Navigate to='/login' />
    }
  return (isAuthenticated)?<Outlet/>:<Navigate to='/login'/>
}

export default protectRoute;