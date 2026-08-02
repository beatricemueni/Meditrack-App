import {useState,useEffect} from "react";
import {apiFetch} from "../api/api";


export default function useFetch(url){


    const [data,setData]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);



    useEffect(()=>{


        async function load(){


            try{

                const result =
                await apiFetch(url);


                setData(result);

            }
            catch(err){

                setError(err.message);

            }
            finally{

                setLoading(false);

            }

        }


        load();


    },[url]);



    return {
        data,
        loading,
        error
    };

}