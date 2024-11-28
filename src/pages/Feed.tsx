import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

const Feed: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<String | null>(null);

    useEffect(() => {
        axios
        .post(
            "http://localhost:8988/api/v1/service",
            {
                "Body" : {
                    user_id: 100,
                    limit: 3,
                    board_id: null,
                }
            },
            {
                headers: {
                    "token": "",
                    "call_url": "/api/board",
                    "call_method": "GET",
                },
            })
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError("Error fetching data");
                setLoading(false);
            });
    }, []);

    if(loading) return <p>Loading...</p>;
    if(error) return <p>{error}</p>;

    return (
        <div>
            <h1>Welcome to the mydays Feed Page!</h1>
            <Link to="/todolist">Todolist</Link>
            <hr />
            <Link to="/viteintro">viteintro</Link>
        </div>
    );
};

export default Feed;