import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { getTraces20 } from '@/utils/jaeger';
import { useRouter } from 'next/router';

const Service = () => {
    const router = useRouter();
    const {serviceName} = router.query;
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const response = await getTraces20(serviceName)
            console.log("response",response);
            setItems(response.data);
        };
        fetchItems();
    }, []);
    console.log("items",items);
    return (
        <>
        <Head>
            <title>{ serviceName }</title>
        </Head>
        <div style={{backgroundColor:'white', color: 'black'}}>
            <h1>{serviceName}'s last 20 Traces</h1>
            <ul>
                {items.map((item) => (
                    <li key={item.traceID}>{item.traceID}</li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default Service;