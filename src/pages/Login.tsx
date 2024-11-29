import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import apiClient from "../service/apiClient";

const Login: React.FC = () => {
    const[error, setError] = useState<string>('');
    const{user,  setUserSession} = useUser();
    const[id, setId] = useState<string>('');
    const[password, setPassword] = useState<string>('');
    const[loading, isLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const setToken = (user_id: string, id: string, user_type: string) => {
        apiClient.post(
            "/api/v1/service",
            {
                Body: {
                    user_id: user_id,
                    id: id,
                    user_type : user_type
                }
            },
            {
                headers: {
                    token: "",
                    call_url: "/api/token",
                    call_method: "POST",
                }
            })
            .then(response => {
                setUserSession({
                    user_id: user_id,
                    id: id,
                    user_type: user_type,
                    token: response.data,
                });
            })
            .catch(err => {
                setError("인증요청 실패");
            })
    }
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        isLoading(true);

        apiClient.post(
            "/api/v1/service",
            {
                Body: {
                    id: id,
                    password: password
                }
            },
            {
                headers: {
                    "token": "",
                    "call_url": "/api/user/login",
                    "call_method": "POST",
                },
            })
            .then(response => {
                const responseBody = response.data;
                if(responseBody !== "")
                {
                    setUserSession({
                        user_id: responseBody.user_id || '',
                        id: responseBody.id || '',
                        user_type: responseBody.user_type || '',
                        token: ''
                    });
                    setToken(responseBody.user_id, responseBody.id, responseBody.user_type);
                    navigate("/");
                }
                else
                {
                    setError("유효하지 않은 사용자 정보입니다.");
                }
            })
            .catch(err => {
                console.error("Error : ", err);
            })
            .finally(() => {
                isLoading(false);
            });
    }
    return (
    <div>
        <h1>로그인</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
            <div>
                <label htmlFor="id">아이디 :</label>
                <input 
                    type="text"
                    id="id"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">비밀번호 :</label>
                <input 
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" disabled={loading}>{loading ? "로그인 중..." : "로그인"}</button>
        </form>
    </div>
    );
}
export default Login;