import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../components/UserContext";
import apiClient from "../service/apiClient";
import debounce from "lodash/debounce";
import { Client } from '@stomp/stompjs';
import { AddIcon } from "../utils/Material";

interface Board {
    board_id: number;
    user_id: number;
    scope_of_disclosure: string;
    create_time: string;
    fulfillment_time: string;
    content: string;
    update_time: string;
}
const Feed: React.FC = () => {
    const[ board, setBoard ] = useState<Board[]>([]);
    const[ loading, setLoading ] = useState<boolean>(false);
    const[ hasMore, setHasMore ] = useState<boolean>(true);
    const{ user } = useUser();
    const containerRef = useRef<HTMLDivElement>(null); // 스크롤 컨테이너 참조용

    
    // useEffect는 1회성 함수이다.
    // 처음 페이지가 호출될 때 실행되고 작업을 처리한 뒤 만약 상태를 저장하는 작업을 진행했을 경우
    // 페이지가 렌더링되는것을 캐치한 뒤 다시 실행하는? 뭐 그런거라네
    useEffect(() => {
        const container = containerRef.current;
        const client = new Client({
            brokerURL: import.meta.env.VITE_WS_BASE_URL,
            reconnectDelay: 5000,
            connectHeaders: {
                token: user?.token ? user.token : '',
                call_url: "/ws",
                call_method: "WS"
            }
        });
        if(user?.user_id && user?.token && !loading)
        {
            getBoard(
                user.user_id, 
                user.token, 
                board.length > 0 
                    ? Math.min(...board.map((item: { board_id: number}) => item.board_id))
                    : '');
            client
                .onConnect = () => {
                    console.log("onConnect");
                    try{
                        client.subscribe('/board/all', (message) => {
                            if (message.body) {
                                const newMessage: Board = JSON.parse(message.body);
                                newMessage.create_time = "방금전";
                                setBoard((prevMessages) => [newMessage, ...prevMessages]);
                            }
                        });
                    }
                    catch( error )
                    {
                        console.error("error : ", error);
                    }
                    // 개인 채널 구독
                    client.subscribe('/board/friends:'+user.user_id, (message) => {
                        console.log("onFriends");
                        if (message.body) {
                            const newMessage: Board = JSON.parse(message.body);
                            console.log("Friends = ",newMessage);
                            setBoard((prevMessages) => [newMessage, ...prevMessages]);
                        }
                    });
                    client.subscribe('/board/community:'+user.user_id, (message) => {
                        console.log("onCommunity");
                        if (message.body) {
                            const newMessage: Board = JSON.parse(message.body);
                            console.log("Commu = ", newMessage);
                            setBoard((prevMessages) => [newMessage, ...prevMessages]);
                        }
                    });
                };
            client.onStompError = (err) => {
                console.error("Stomp Error", err);
            }
            client.onDisconnect = () => {
                console.log("Disconnected");
            }
            client.activate();
        }
        
        if( container )
        {
            container.addEventListener("scroll", handleScroll);
        }

        return () => {
            if( container )
            {
                container.removeEventListener("scroll", handleScroll);
            }
            if( client )
            {
                client.deactivate();
            }
        }
    }, [user]);
    const getBoard = (user_id: string, token: string, board_id? : number | '') => {
        if(!hasMore || loading)
        {
            return;
        }
        setLoading(true);
            apiClient
                    .post(
                        "/api/v1/service",
                        {
                            Body : {
                                user_id: user_id,
                                limit: 10,
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
                            
                            if( response.data !== null && response.data.length > 0)
                            {
                                setBoard((prevBoard) => {
                                    const newBoard = [...prevBoard, ...response.data];

                                    const prevBoardIds = prevBoard.map((item: { board_id: number}) => item.board_id);
                                    const responseBoardIds = response.data.map((item: { board_id: number}) => item.board_id);

                                    const min = prevBoardIds.length > 0 ? Math.min(...prevBoardIds) : Number.MAX_SAFE_INTEGER;
                                    const max = responseBoardIds.length > 0 ? Math.max(...responseBoardIds) : Number.MAX_SAFE_INTEGER;

                                    if( min > max )
                                    {
                                        setHasMore(true);
                                        return newBoard;
                                    }
                                    else
                                    {
                                        setHasMore(false);
                                        return prevBoard;
                                    }
                                });
                            }
                            else
                            {
                                setHasMore(false);
                            }
                            setLoading(false);
                        })
                        .catch(error => {
                            console.error("Error : ", error);
                            setLoading(false);
                        });
        setLoading(false);
    };

    const handleScroll = debounce(() => {
        if( containerRef.current )
        {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            if( scrollTop + clientHeight >= scrollHeight - 100 )
            {
                if(user?.user_id && user?.token && board !== null && !loading)
                {
                    const user_id = user.user_id;
                    const token = user.token;
                    setBoard(prevBoard => {
                        const minBoardNumber = Math.min(...prevBoard.map((item: { board_id: number; }) => item.board_id));
                        getBoard(user_id, token, minBoardNumber === Infinity ? '' : minBoardNumber);
                        return prevBoard;
                    });
                }
            }
            else
            {
                
            }
        }
    }, 500);
    return (
        <div>
            <div ref={containerRef} style={{ height: "1000px", overflowY: "auto", border: "1px solid black", position: "relative"}}>
                <h1>Welcome to the mydays Feed Page!</h1>
                <Link to="/todolist">Todolist</Link>
                <hr />
                <Link to="/viteintro">viteintro</Link>
                <hr />
                {board && Array.isArray(board) && (
                    <ul>
                        {board.map((item: any) => (
                            <li key={item.board_id}>
                                <Link to={`/detail?id=${item.board_id}`}>
                                <p>{item.board_id}</p>
                                <p>{item.user_id}</p>
                                <p>{item.scope_of_disclosure}</p>
                                <p>{item.create_time}</p>
                                <p>{item.fulfillment_time}</p>
                                <p>{item.content}</p>
                                <p>{item.update_time}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Link to="/write">
                <button 
                    style={{
                    position: "fixed", // div 내에서 고정
                    bottom: "3rem", // div의 top에서부터 간격
                    right: "3rem", // div의 right에서부터 간격
                    zIndex: 1000 // 버튼이 내용보다 위로 올라오도록 설정
                    }}
                >
                    <AddIcon />
                </button>
            </Link>
        </div>
    );
};

export default Feed;