import React from "react";
import { useUser } from "../components/UserContext";

const Profile: React.FC = () => {
    const{ user } = useUser();
    return (
        <div>
            <h1>사용자 정보 /</h1>
            {user 
            ? (
                <p>안녕하세요, {user.id}님! <br/> 회원유형 : {user.user_type}</p>
            )
            : (
                <p>로그인해주세요</p>
            )
            }
        </div>
    );
};

export default Profile;