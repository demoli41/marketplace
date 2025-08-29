"use client";

import React from 'react'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';
import {Toaster} from "react-hot-toast"

const Providers = ({children}:{children:React.ReactNode}) => {

    const [queryClient] = React.useState(() => new QueryClient({
      defaultOptions:{
        queries:{
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000, // 5 minutes
        }
      }
    }));

  return (
    <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
    </QueryClientProvider>
  )
}

export default Providers