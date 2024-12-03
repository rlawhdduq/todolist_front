import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/UserContext";
import apiClient from "../../service/apiClient";
import Select from "react-select";

interface Todolist{
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
    onRemove: (id:number) => void;
}> = ({ id, todo, onChange, onRemove }) => {
    const handleInputChange = (field: keyof Todolist, value: string | number) => {
        onChange(id, {...todo, [field]: value});
    };

    return(
        <div>
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
            <button type="button" onClick={() => onRemove(id)}>삭제</button>
        </div>
    );
};

const Write: React.FC = () => {
    const[todos, setTodo] = useState<Todolist[]>([]);
    const[error, setError] = useState<string>('');
    const{user,  setUserSession} = useUser();
    const[scopeOptions, setOptions] = useState<any[]>([]);
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

    const removeTodo = (id: number) => {
        setTodo((prev) => prev.filter((_, i) => i !== id));
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

    const[content, setContent] = useState<string>('');
    const[scope, setScope] = useState<string>('');
    const[loading, isLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    let token = user?.token;
    let userId = user?.user_id;

    const handleScope = (scope: any) => {
        setScope(scope.value);
    };

    const handleWrite = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        isLoading(true);
        console.log(scope);
        apiClient.post(
            "/api/v1/service",
            {
                Body: {
                    user_id: userId,
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
                    "call_method": "POST",
                },
            })
            .then(() => {
                navigate("/");
            })
            .catch(err => {
                navigate("/write");
                console.error("Error : ", err);
            })
    }

    return (
    <div>
        <h1>게시글 작성</h1>
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
            <button type="submit">뭔가</button>
            <div>
                {todos.map((todo, id) => (
                    <TodoComponent 
                        key={id}
                        id={id}
                        todo={todo}
                        onChange={updateTodo}
                        onRemove={removeTodo}
                    />
                ))}
            </div>
            <button type="button" onClick={addTodo}>Todolist추가</button>
            
        </form>
    </div>
    );
}
export default Write;