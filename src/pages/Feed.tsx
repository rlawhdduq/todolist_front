import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../components/UserContext";
import apiClient from "../service/apiClient";
import debounce from "lodash/debounce";

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
    let cnt = 0;
    const[ board, setBoard ] = useState<Board[]>([]);
    const[ loading, setLoading ] = useState<boolean>(false);
    const[ error, setError ] = useState<String | null>(null);
    const[ hasMore, setHasMore ] = useState<boolean>(true);
    const{ user } = useUser();
    const containerRef = useRef<HTMLDivElement>(null); // 스크롤 컨테이너 참조용

    // useEffect는 1회성 함수이다.
    // 처음 페이지가 호출될 때 실행되고 작업을 처리한 뒤 만약 상태를 저장하는 작업을 진행했을 경우
    // 페이지가 렌더링되는것을 캐치한 뒤 다시 실행하는? 뭐 그런거라네
    useEffect(() => {
        if(user?.user_id && user?.token && !loading)
        {
            getBoard(
                user.user_id, 
                user.token, 
                board.length > 0 
                    ? Math.min(...board.map((item: { board_id: number}) => item.board_id))
                    : '');
            setLoading(true);
        }
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
    }, [user]);
    const getBoard = (user_id: string, token: string, board_id? : number | '') => {
        // console.log("cnt = ", cnt);
        // cnt++;
        // console.log(loading);
        if(!hasMore || loading)
        {
            console.log("안돼용");
            return;
        }
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
                            
                            if( response.data !== null && response.data.length > 0)
                            {
                                // console.log("respose", response);
                                setBoard((prevBoard) => {
                                    const newBoard = [...prevBoard, ...response.data];

                                    // console.log("prev = ",prevBoard);
                                    // console.log("response = ",response.data);
                                    const prevBoardIds = prevBoard.map((item: { board_id: number}) => item.board_id);
                                    const responseBoardIds = response.data.map((item: { board_id: number}) => item.board_id);

                                    const min = prevBoardIds.length > 0 ? Math.min(...prevBoardIds) : Number.MAX_SAFE_INTEGER;
                                    const max = responseBoardIds.length > 0 ? Math.max(...responseBoardIds) : Number.MAX_SAFE_INTEGER;

                                    // console.log("min = "+min);
                                    // console.log("max = "+max);
                                    if( min > max )
                                    {
                                        // console.log("cnt = ", cnt);
                                        // console.log("추가한다");
                                        setHasMore(true);
                                        return newBoard;
                                    }
                                    else
                                    {
                                        // console.log("cnt = ", cnt);
                                        // console.log("방패가동");
                                        setHasMore(false);
                                        return prevBoard;
                                    }
                                });
                            }
                            else
                            {
                                // console.log("false설정")
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
            // console.log("check");
            // console.log((scrollTop + clientHeight) + "-" + ((scrollHeight - 10)));
            if( scrollTop + clientHeight >= scrollHeight - 10 )
            {
                if(user?.user_id && user?.token && board !== null && !loading)
                {
                    const user_id = user.user_id;
                    const token = user.token;
                    // console.log("간닷");
                    setBoard(prevBoard => {
                        // console.log("prevBoard = ", prevBoard);
                        const minBoardNumber = Math.min(...prevBoard.map((item: { board_id: number; }) => item.board_id));
                        // console.log("넘긴다 board = ",(minBoardNumber === Infinity ? '' : minBoardNumber));
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
    // if(loading) return <p>Loading...</p>;
    // if(error) return <p>{error}</p>;
    return (
        <div ref={containerRef} style={{ height: "500px", overflowY: "auto", border: "1px solid black"}}>
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