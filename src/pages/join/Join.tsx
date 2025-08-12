import { useState } from "react";
import apiClient from "../../service/apiClient";
import { useUser } from "../../components/UserContext";
import Select from "react-select";


const Join: React.FC = () => {
    const{ setUserSession } = useUser();

    const[ id, setId ] = useState<string>('');
    const[ pw, setPw ] = useState<string>('');
    const[ ph, setPh ] = useState<string>('');
    const[ birth, setBirth ] = useState<string>('');
    const[ addr, setAddr ] = useState<string>('');
    const[ addrDt, setAddrDt ] = useState<string>('');
    const[ gender, setGender ] = useState<string>('');
    const[ loading, isLoading ] = useState<boolean>(false);

    const genderOptions = [
        { value: "M", label: "남자" },
        { value: "W", label: "여자" },
    ]
    
    const handleGender = (selectedOption: any) => {
        setGender(selectedOption.value);
    }
    const setToken = (user_id: string, id: string, user_type: string) => {
        apiClient.post(
            "/api/v1/service",
            {
                Body: {
                    user_id: user_id,
                    id: id,
                    user_type: user_type,
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
                number_of_following: '',
                number_of_follower: '',
            })
        })
        .catch()
    }
    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if(loading)
        {
            alert("처리중");
            return;
        }
        isLoading(true);
        apiClient.post(
            "/api/v1/service",
            {
                Body: {
                    id: id,
                    password: pw,
                    addr: addr,
                    addr_dt: addrDt,
                    birth: birth,
                    ph: ph,
                    gender: gender,
                }
            },
            {
                headers: {
                    token: "",
                    call_url: "/api/user/join",
                    call_method: "POST",
                }
        })
        .then(response => {
            const responseData = response.data;
            setToken(responseData.user_id, responseData.id, responseData.user_type);
        })
        .catch(err => {
            console.error("Error = ", err);
        });
        isLoading(false);
    }
    return (
        <div>
            <h1>회원가입</h1>
            <form onSubmit={handleJoin}>
                <div>
                    <label htmlFor="id">계정(이메일)</label>
                    <input 
                        type="text"
                        id="id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                    <button type="button">이메일 인증</button>
                </div>
                <div>
                    <label htmlFor="pw">비밀번호</label>
                    <input 
                        type="password"
                        id="pw"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="ph">전화번호</label>
                    <input 
                        type="text"
                        id="ph"
                        value={ph}
                        onChange={(e) => setPh(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="birth">생년월일</label>
                    <input 
                        type="text"
                        id="birth"
                        value={birth}
                        onChange={(e) => setBirth(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="addr">주소</label>
                    <input 
                        type="text"
                        id="addr"
                        value={addr}
                        onChange={(e) => setAddr(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="addrDt">상세주소</label>
                    <input 
                        type="text"
                        id="addrDt"
                        value={addrDt}
                        onChange={(e) => setAddrDt(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="gender">성별 </label>
                    <Select 
                        value={genderOptions.find(option => option.value === gender)}
                        onChange={handleGender}
                        options={genderOptions}
                        placeholder="성별"
                        required
                    />
                </div>
            <div><button type="submit">가입하기</button></div>
            </form>
        </div>
    )
}

export default Join;