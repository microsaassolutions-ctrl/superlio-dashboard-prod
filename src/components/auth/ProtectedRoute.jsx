import React, { useEffect, useState } from "react";
import { get } from "../../api/apiService";
import { Shimmer } from "../commons";
import useMainStore from "../../store/useMainStore";
import { contactSupportUrl, redirectionUrl } from "../../utils/config";
import Subscription from "../../pages/subscription/Subscription";
import LoginRedirectBox from "../commons/LoginRedirectBox";

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState({ url: "/", message: "", btn :'' });
    const { setSettings, getAuth } = useMainStore();
    const showLoginRedirectBox = useMainStore((state) => state.showLoginRedirectBox);

    useEffect(() => {
        const authCall = async () => {
            try {
                setLoading(true);
                const res = await getAuth();
                if (res && res?.email) {
                    if(!res?.is_active_subscription){
                       setAuthenticated(false);
                        setRedirectUrl({ 
                            url: res?.redirect_url, 
                            message: "Your Subscription is expired.",
                            btn : "Purchase Subscription"
                        }); 
                    }else if(res?.is_allow_content){
                        setAuthenticated(true);
                    } else if(!res?.is_allow_content){
                        setRedirectUrl({ 
                            url: contactSupportUrl, 
                            message: "This feature is not available in your plan.",
                            btn :"Contact support"
                        });
                        setAuthenticated(false);
                    }else{
                        setAuthenticated(true);
                    }
                } else {
                    setAuthenticated(null); // Not logged in
                }
            } catch {
                setAuthenticated(null); // Not logged in
            } finally {
                setLoading(false);
            }
        };
        authCall();
    }, []);

    if (loading) return <Shimmer />;

    if (showLoginRedirectBox) return <LoginRedirectBox redirectUrl={redirectionUrl} />;
    if (authenticated === true) return children;
    if (authenticated === false) return <Subscription subscriptionDetails={redirectUrl}/>;
    if (authenticated === null) return <LoginRedirectBox />;
};

export default ProtectedRoute;
