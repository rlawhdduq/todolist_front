import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../service/apiClient";
import { useUser } from "../../components/UserContext";
import { useLocation } from "react-router-dom";

interface Board {
    board_id:           number;
    user_id:            number;
    scope_of_disclosure:string;
    create_time:        string;
    fulfillment_time:   string;
    content:            string;
    update_time:        string;
    todolist :          Todolist;
    reply:              Reply;
}
interface Todolist {
    todolist_id:        number;
    create_time:        string;
    todo_type:          string;
    todo_type_detail:   string;
    todo_unit:          string;
    todo_number:        number;
    fulfillment_or_not: string;
    update_time:        string;
}
interface Reply {
    reply_id:       number;
    board_id:       number;
    user_id:        number;
    content:        string;
    reply_depth:    number;
    create_time:    string;
    status:         string;
    update_time:    string;
}

const Detail:React.FC = () => {
    const location                  = useLocation()
    const queryParams               = new URLSearchParams(location.search);
    const id                        = queryParams.get("id");
    const{ user }                   = useUser();
    const[ board, setBoard ]        = useState<Board>();
    const[ todolist, setTodolist ]  = useState<Todolist[]>();
    const[ reply, setReply ]        = useState<Reply[]>();
    const decId                     = id;
    
    useEffect(() => {
    if( id )
        {
            localStorage.setItem("boardId", id);
        }
    }, [id]);

    useEffect(() => {
        apiClient.post(
            "/api/v1/service",
            {
                Body: {
                    user_id: user?.user_id || "",
                    board_id: decId,
                }
            },
            {
                headers: {
                    "token": user?.token || "",
                    "call_url": "/api/board/detail" ,
                    "call_method": "GET"
                },
            })
            .then( response => {
                const responseData = response.data;
                if( responseData !== null )
                {
                    setBoard(responseData);
                    setTodolist(responseData.todolist);
                    setReply(responseData.reply);
                }
            })
            .catch( err => {
                console.error("Error = ", err);
            });
    }, []);

    return(
        <div>
            <div>
            {board
            ? 
                <div>
                    <ul>
                        <li>
                            <p>{board.board_id}</p>
                            <p>{board.user_id}</p>
                            <p>{board.scope_of_disclosure}</p>
                            <p>{board.create_time}</p>
                            <p>{board.fulfillment_time}</p>
                            <p>{board.content}</p>
                            <p>{board.update_time}</p>
                        </li>
                    </ul>
                </div> 
                
            : 
                <div></div>
            }
            </div>
            {todolist
            ?
                <div>
                    <ul>
                        {todolist.map((todo: Todolist) => (
                            <li key={todo.todolist_id}>
                                <p>{todo.todolist_id}</p>
                                <p>{todo.create_time}</p>
                                <p>{todo.todo_type}</p>
                                <p>{todo.todo_type_detail}</p>
                                <p>{todo.todo_unit}</p>
                                <p>{todo.todo_number}</p>
                                <p>{todo.fulfillment_or_not}</p>
                                <p>{todo.update_time}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            :
                <div></div>
            }
            <div>
            {reply?.length && reply?.length > 0 
            ?
                <div>
                    <ul>
                        {reply?.map((rep: Reply) => (
                        <li>
                            <p>{rep.reply_id}</p>
                            <p>{rep.board_id}</p>
                            <p>{rep.user_id}</p>
                            <p>{rep.content}</p>
                            <p>{rep.reply_depth}</p>
                            <p>{rep.create_time}</p>
                            <p>{rep.status}</p>
                            <p>{rep.update_time}</p>
                        </li>
                        ))}
                    </ul>
                </div>
            :
                <div>댓글이 없습니다</div>
            }
            </div>
            {board?.user_id == Number(user?.user_id) && (
                <div>
                    <Link to={`/write/${id}`}>
                        <button>수정하기</button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Detail;