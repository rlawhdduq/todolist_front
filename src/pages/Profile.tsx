import React , { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../components/UserContext";
import apiClient from "../service/apiClient";

interface ViewUserInfo 
{
    id: string;
    user_id: string;
    user_type: string;
    number_of_follower: number;
    number_of_following: number;
}

const Profile: React.FC = () => {
    const{ user: loginUser } = useUser();
    const{ viewUserId } = useParams<{ viewUserId: string }>();

    const[ viewUserInfo, setViewUserInfo ] = useState<ViewUserInfo | null>(null);

    useEffect(() => {
        // 보여줄 최종 user_id를 결정하는 로직
        if(viewUserId)
        {
            apiClient.post(
            "/api/v1/service",
            {
                Body: {
                    user_id: viewUserId,
                }
            },
            {
                headers: {
                    "token": loginUser?.token,
                    "call_url": "/api/user/login",
                    "call_method": "GET",
                },
            })
            .then(response => {
                const responseBody = response.data;
                if(responseBody !== "")
                {
                    console.log(responseBody);
                    setViewUserInfo(responseBody);
                }
                else
                {
                    alert("유효하지 않은 사용자 정보입니다.");
                }
            })
            .catch(err => {
                console.error("Error : ", err);
            })
            .finally(() => {
            });
        }
    }, [viewUserId, loginUser]);

    const isMyProfile = loginUser?.user_id === viewUserInfo?.user_id;
    return (
        <div>
            <h1>사용자 정보 /</h1>
            {loginUser? 
            (
                <div>
                <p>
                    {loginUser.id}님의 프로필 정보
                    <br/> 
                    회원유형 : {loginUser.user_type}
                    <br/>
                    팔로워 수 : {loginUser.number_of_follower}
                    <br/>
                    팔로잉 수 : {loginUser.number_of_following}
                </p>
                <br/>
                {isMyProfile? (null) : ( <div><button>팔로우</button><button>팔로우취소</button></div> )}
                </div>
            )
            : (
                <p>로그인해주세요</p>
            )}
        </div>
    );
};

export default Profile;