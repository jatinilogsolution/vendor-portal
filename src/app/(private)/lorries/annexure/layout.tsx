"use client"
import React from 'react'
import { AnnexureValidationProvider } from '../_components/annexure/annexure-context'

const AnnexureLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <AnnexureValidationProvider>
        {children}
    </AnnexureValidationProvider>
  )
}

export default AnnexureLayout