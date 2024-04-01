import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewRec.css'

function SalesRecView() {
    const [data, setData] = useState([]);
    const [audio, setAudio] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const responseData = await axios.get('http://13.232.127.73:5000/data');
            setData(responseData.data);

            // Fetch audio data once
            const audioResponse = await axios.get('http://13.232.127.73:5000/salesaudio');
            setAudio(audioResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Create a dictionary to store unique leadIds
    const leadIds = {};
    audio.forEach((audioItem) => {
        if (!leadIds[audioItem.customerPan]) {
            leadIds[audioItem.customerPan] = audioItem.leadId;
        }
    });

    return (
        <div>
            <h1>Data With Sales Recording</h1>
            <table>
                <thead>
                    <tr>
                        <th>S.NO</th>
                        <th>Date Of Login</th>
                        <th>Employee Id Of Case Owner</th>
                        <th>Employee Name</th>
                        
                        <th>Manager Name</th>
                        <th>Customer Pan</th>
                        
                        <th>Emp ID</th>
                        <th>Employee Name</th>
                        <th>Sales Audio</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item,index) => (
                        <tr key={item._id}>
                           
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>{item.dateOfLogin}</td>
                            <td>{item.employeeIdOfCaseOwner}</td>
                            <td>{item.employeeName}</td>
                            
                            <td>{item.managerName}</td>
                            <td>{item.customerPan}</td>
                            
                            <td>{leadIds[item.customerPan]}</td> {/* Display leadId */}
                            <td>
                                 {audio
                                  .filter((audioItem) => audioItem.customerPan === item.customerPan)
                                   .map((audio) => (
                                    <div key={audio._id}>
                                    {audio.empName}
                                   </div>
                                     ))}
                                 </td>


                                    <td>
                                {audio
                                    .filter((audioItem) => audioItem.customerPan === item.customerPan)
                                    .map((audio) => (
                                        <audio key={audio._id} controls>
                                            <source
                                                src={`http://13.232.127.73:5000/sales/audio/${audio._id}`}
                                                type={audio.contentType}
                                                
                                            />
                                            Your browser does not support the audio element.
                                        </audio>
                                    ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SalesRecView;
