import { Button } from '@/components/ui/button'
import  ItemHandover  from '@/components/views/itemHandover';
import { API } from '@/lib/API'
import React, { useEffect, useState } from 'react'

import ReactJsonPretty from 'react-json-pretty';

export const test = () => {
  // const [APIResponse, setAPIResponse] = useState()
  // const [url, setUrl] = useState<string>('verify/claimant/')
  // async function fetch(){
  //   try {
  //     const response = await API.get(url)
  //     console.log('response ', response.data);
  //     setAPIResponse(response.data)

  //   } catch (first) {
      
  //   }
  // }
  
  // useEffect(()=>{
  //   fetch()
  // }, [])

  return (

    <>
    <div>
      {/* <input type="text" 
        onChange={(e) => setUrl(e.target.value)}
        value={url}
      />
      <Button
        onClick={()=>{fetch()}}
      >
        Go
      </Button> */}
    </div>
    <div>
        {/* {JSON.stringify(APIResponse, null, 2)} */}
        {/* <ReactJsonPretty data={APIResponse} /> */}
    </div>

    <div>
      <ItemHandover/>
    </div>
    </>
  )

  
}


export default test