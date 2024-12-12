import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../components/UserContext";
import apiClient from "../../service/apiClient";
import Select from "react-select";

interface Todolist{
    todolist_id?: number;
    todo_type: string;
    todo_type_detail: string;
    todo_unit: string;
    todo_number: number;
    fulfillment_or_not: string;
}
const TodoComponent: React.FC<{
    id : number;
    todo: Todolist;
    onChange: (id:number, updateTodo: Todolist) => void;
    onRemove: (id:number, todolist_id?: number) => void;
    onCheck: (event:React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, todo, onChange, onRemove, onCheck }) => {
    const handleInputChange = (field: keyof Todolist, value: string | number) => {
        onChange(id, {...todo, [field]: value});
    };
    const handleTodoCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        onCheck(event);
    };

    return(
        <div>
            <label>
                <input
                    type="checkbox"
                    data-key={todo.todolist_id}
                    onChange={(e) => handleTodoCheck(e)}
                />
            </label>
            <label htmlFor={`todo_type_${id}`}>유형</label>
                <input 
                    type="text"
                    id={`todo_type_${id}`}
                    value={todo.todo_type}
                    onChange={(e) => handleInputChange("todo_type", e.target.value)}
                    required
                />
            <label htmlFor={`todo_type_detail_${id}`}>상세유형</label>
                <input 
                    type="text"
                    id={`todo_type_detail_${id}`}
                    value={todo.todo_type_detail}
                    onChange={(e) => handleInputChange("todo_type_detail", e.target.value)}
                    required
                />
            <label htmlFor={`todo_unit_${id}`}>단위</label>
                <input 
                    type="text"
                    id={`todo_unit_${id}`}
                    value={todo.todo_unit}
                    onChange={(e) => handleInputChange("todo_unit", e.target.value)}
                    required
                />
            <label htmlFor={`todo_number_${id}`}>횟수</label>
                <input 
                    type="text"
                    id={`todo_number_${id}`}
                    value={todo.todo_number}
                    onChange={(e) => handleInputChange("todo_number", e.target.value)}
                    required
                />
            <button type="button" onClick={() => onRemove(id, todo.todolist_id)}>삭제</button>
        </div>
    );
};

const Write: React.FC = () => {
    const[ todos, setTodo ] = useState<Todolist[]>([]);
    const[ , setError ] = useState<string>('');
    const{ user } = useUser();
    const[ scopeOptions, setOptions ] = useState<any[]>([]);
    const[ content, setContent ] = useState<string>('');
    const[ scope, setScope ] = useState<string>('');
    const[ , isLoading ] = useState<boolean>(false);
    const{ postId } = useParams<{ postId: string }>();
    const[ isEditMode, setIsEditMode ] = useState<boolean>(false);
    const[ selectTodoKeys, setSelectTodoKeys ] = useState<number[]>([]);
    const navigate = useNavigate();
    const token = user?.token;
    const userId = user?.user_id;

    const nOption = [
        { value: 'A', label: '전체'},
        { value: 'F', label: '친구만'},
        // { value: 'C', label: '커뮤니티'},
    ];
    const cOption = [
        { value: 'A', label: '전체'},
        { value: 'F', label: '친구만'},
        { value: 'C', label: '커뮤니티'},
    ];
    const ocOption = [
        { value: 'C', label: '커뮤니티'}
    ];

    const addTodo = () => {
        setTodo((prev) => [
            ...prev, 
            {
                todo_type: '',
                todo_type_detail: '',
                todo_unit: '',
                todo_number: 0,
                fulfillment_or_not: '',
            }
        ]);
    }
    const updateTodo = (id: number, updateTodo: Todolist) => {
        setTodo((prev) => prev.map((todo, i) => (i === id ? updateTodo : todo)));
    };

    const removeTodo = (id: number, todolist_id?: number) => {
        if(confirm("정말로 삭제하시겠습니까?"))
        {
            setTodo((prev) => prev.filter((_, i) => i !== id));
            if( postId ) deleteTodo(todolist_id);
        }
    }

    const todoCheckBoxControl = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked  = event.target.checked;
        if( postId )
        {
            setSelectTodoKeys( prev => {
                const key = Number(event.target.getAttribute("data-key"));
                if( checked )
                {
                    return [...prev, key];
                }
                else
                {
                    return selectTodoKeys.filter(item => item !== key);
                }
            })
        }
    }
    const detailDeleteTodo = () => {
        if(confirm("선택된 항목들을 정말로 삭제하시겠습니까?"))
        {
            if(selectTodoKeys.length <= 0)
            {
                alert("선택된 항목이 없습니다.");
            }
            else
            {
                setTodo((prev) => {
                    return prev.filter((_, i) => !selectTodoKeys.includes(i))
                });
                if( postId ) deleteTodo();
            }
        }
    }

    useEffect(() => {
        switch( user?.user_type )
        {
            case "NC" : setOptions(nOption);
                break;
            case "GC" : setOptions(cOption);
                break;
            case "CC" : setOptions(ocOption);
                break;
            default :
                break;
        }
    }, [user]);

    useEffect(() => {
        if( postId )
        {
            setIsEditMode(true);
            apiClient.post(
                "/api/v1/service",
                {
                    Body : {
                        user_id: userId,
                        board_id: postId ,
                    }
                },
                {
                    headers: {
                        "token": token,
                        "call_url": "/api/board/detail",
                        "call_method": "GET",
                    }
                })
                .then(response => {
                    const responseData = response.data;
                    setContent(responseData.content);
                    setScope(responseData.scope_of_disclosure);
                    setTodo(responseData.todolist || []);
                })
                .catch();
        }
    }, [ postId ]);

    const deleteTodo = (todolist_id?: number) => {
        apiClient.post(
            "/api/v1/service",
            {
                Body : {
                    foreign_key: postId || "",
                    key_list: todolist_id ? [todolist_id] : selectTodoKeys
                }
            },
            {
                headers: {
                    "token": token,
                    "call_url": "/api/board/todolist/detail",
                    "call_method": "DELETE"
                }
            })
            .then(() => {
            })
            .catch(err => {
                console.log("Error = ", err);
            })
    };

    const handleScope = (scope: any) => {
        setScope(scope.value);
    };

    const handleWrite = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        isLoading(true);

        const method = isEditMode ? "PUT" : "POST";
        apiClient.post(
            "/api/v1/service",
            {
                Body: {
                    user_id: userId,
                    board_id: postId || "",
                    fulfillment_or_not: 'R',
                    content: content,
                    scope_of_disclosure: scope,
                    todolist: todos,
                }
            },
            {
                headers: {
                    "token": token,
                    "call_url": "/api/board",
                    "call_method": method,
                },
            })
            .then(() => {
                
            })
            .catch(err => {
                console.error("Error : ", err);
            })
            navigate("/");
    }

    return (
    <div>
        <h1>게시글 {isEditMode ? "수정" : "작성"}</h1>
        <form onSubmit={handleWrite}>
            <div>
                <label htmlFor="content"></label>
                <textarea 
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="scope">공개 범위</label>
                <Select 
                    value={scopeOptions.find(option => option.value === scope)}
                    onChange={handleScope}
                    options={scopeOptions}
                    placeholder="공개범위"
                />
            </div>
            <button type="submit">{isEditMode ? "수정" : "저장"}</button>
            <div>
                {todos.map((todo, id) => (
                    <TodoComponent 
                        key={id}
                        id={id}
                        todo={todo}
                        onChange={updateTodo}
                        onRemove={removeTodo}
                        onCheck={todoCheckBoxControl}
                    />
                ))}
                {todos && todos.length > 0 && (
                    <button type="button" onClick={detailDeleteTodo}>선택삭제</button>
                )}

            </div>
            <button type="button" onClick={addTodo}>Todolist추가</button>
            
        </form>
    </div>
    );
}
export default Write;