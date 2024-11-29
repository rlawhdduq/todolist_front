import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../components/UserContext";
import apiClient from "../service/apiClient";

const Feed: React.FC = () => {
    const[ board, setBoard ] = useState<any>(null);
    const[ loading, setLoading ] = useState<boolean>(true);
    const[ error, setError ] = useState<String | null>(null);
    const{ user } = useUser();
    const containerRef = useRef<HTMLDivElement>(null); // 스크롤 컨테이너 참조용

    // useEffect는 1회성 함수이다.
    // 처음 페이지가 호출될 때 실행되고 작업을 처리한 뒤 만약 상태를 저장하는 작업을 진행했을 경우
    // 페이지가 렌더링되는것을 캐치한 뒤 다시 실행하는? 뭐 그런거라네
    useEffect(() => {
        if(user?.user_id && user?.token)
        {
            getBoard(user.user_id, user.token);
            const container = containerRef.current;

            if( container )
            {
                container.addEventListener("scroll", handleScroll);
            }

            return () => {
                if( container )
                {
                    container.removeEventListener("scroll", handleScroll);
                }
            }
        }
    }, [user, board]);
    const getBoard = (user_id: string, token: string, board_id? : number | null) => {
            apiClient
                    .post(
                        "/api/v1/service",
                        {
                            Body : {
                                user_id: user_id,
                                limit: 2,
                                board_id: board_id,
                            }
                        },
                        {
                            headers: {
                                "token": token,
                                "call_url": "/api/board",
                                "call_method": "GET",
                            },
                        })
                        .then(response => {
                            setBoard(response.data);
                        })
                        .catch(error => {
                            console.error("Error : ", error);
                        });
            setLoading(false);
    };

    const handleScroll = () => {
        if( containerRef.current )
        {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

            if( scrollTop + clientHeight >= scrollHeight - 10 )
            {
                if(user?.user_id && user?.token && board !== null)
                {
                    const maxBoardNumber = Math.max(...board.map((item: { board_id: number; }) => item.board_id))
                    console.log(maxBoardNumber);
                    getBoard(user.user_id, user.token, maxBoardNumber);
                }
            }
        }
    }
    // if(loading) return <p>Loading...</p>;
    // if(error) return <p>{error}</p>;
    return (
        <div ref={containerRef} style={{ height: "400px", overflowY: "auto", border: "1px solid black"}}>
            <h1>Welcome to the mydays Feed Page!</h1>
            <Link to="/todolist">Todolist</Link>
            <hr />
            <Link to="/viteintro">viteintro</Link>
            <hr />
            {board && Array.isArray(board) && (
                <ul>
                    {board.map((item: any, index: number) => (
                        <li key={index}>
                            <p>{item.board_id}</p>
                            <p>{item.user_id}</p>
                            <p>{item.scope_of_disclosure}</p>
                            <p>{item.create_time}</p>
                            <p>{item.fulfillment_time}</p>
                            <p>{item.content}</p>
                            <p>{item.update_time}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Feed;