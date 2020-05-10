import React, {useState} from 'react';
import './App.css';

import axios from './utils/axiosUtil';

function App() {


    const [info, setInfo] = useState('');
    const [person, setPerson] = useState({
        user_id : '',
        user_name : '',
        user_password : '',
    });

    const callGraphQL = async () => {
        // server : http://localhost:8000
        const result = await axios.post('http://localhost:8000/graphql', {
            query: `query {
                info
            }`
        });

        if (result.status === 200) {
            console.log(result.data);
            setInfo(result.data.data.info);
        } else {
            console.log(result);
        }
    };

    const callGraphQL2 = async () => {
        // server : http://localhost:8000

        const userName = 'zero86';
        const userPassword = '123456789';

        const result = await axios.post('http://localhost:8000/graphql', {
            query: `mutation {
                createPerson(
                    userName : "${userName}" 
                    userPassword : "${userPassword}"
                ) {
                user_id
                user_name
                user_password
                }
            }`
        });

        if (result.status === 200) {
            console.log(result.data);
            setPerson({...result.data.data.createPerson});
        } else {
            console.log(result);
        }
    };

    return (
        <div className="App">
            <div>
                test graphQL call
                <button className="btn" onClick={callGraphQL}>
                    call
                </button>
                <button className="btn" onClick={callGraphQL2}>
                    create person
                </button>

                <hr/>
                {info}
                <hr/>
                {person.user_id} <br/>
                {person.user_name} <br/>
                {person.user_password}
            </div>
        </div>
    );
}

export default App;
