import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import regeneratorRuntime from "regenerator-runtime";
import 'regenerator-runtime/runtime';

const CloseJobService = (id_to_close) => {
    console.log("id to close : " + id_to_close);
    var cookies = Cookies.get('talentAuthToken');
    console.log("cookies : " + cookies);
    const link = 'http://localhost:51689/listing/listing/closeJob';
    const idField = id_to_close;
    const headerField = {
        headers: {
            'authorization': 'bearer ' + cookies,
            'content-type': 'application/json'
        }
    };

    axios
        .post(
            link,            
            idField,
            headerField            
        )
        .then((response) => {
            console.log(response);
            return true;
        })
        .catch((error) => {
            console.log(error)
            return false;
        });
}

const GetEmployerService = async (jobsLink) => {
    var cookies = Cookies.get('talentAuthToken');
    let retValue;
    let retData;
    const headerField = {        
        headers: {
            'Authorization': 'Bearer ' + cookies,
            'Content-Type': 'application/json'
        }
    };
    var ret = await axios
        .get(
            jobsLink,
            headerField
        )
        .then((response) => {
            console.log(response);
            console.log(response.status);
            console.log(response.data);
            console.log(response.data.success);
            console.log(response.data.myJobs);
            console.log(response.data.totalCount);
            return response.data;
        })
        .catch((error) => {
            console.log(error);
            throw error("Unable to get data");
        });
    //console.log("retValue: " + retValue);
    //console.log("retData: " + retData);
    //console.log("ret: " + ret);    
}


export { CloseJobService, GetEmployerService };
