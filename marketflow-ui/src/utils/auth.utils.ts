import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useAuth = () => { 
    const [isLoading, setLoading] = useState(true);
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [searchParams]= useSearchParams();
    useEffect(() => { 
        let item = localStorage.getItem('accessToken')
        let userId = localStorage.getItem('userId');
        if(item == null || userId == null) {
            const accessToken = searchParams.get('accessToken');
            const userId = searchParams.get('userId'); 
            console.log(accessToken)
            if(accessToken == null || userId == null) { 
                setLoading(false);
                return
            }
            localStorage.setItem('userId', userId);
            localStorage.setItem('accessToken', accessToken);
        }
        setLoading(false);
        setAuthenticated(true)
    }, [])
    return  { isAuthenticated, isLoading }
}