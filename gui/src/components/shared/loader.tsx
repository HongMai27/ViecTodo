
import React from 'react'
import SafeAreaWrapper from './safe-area-wrapper'
import { Box, Text } from '../../utils/theme'

const Loader = () => {
  return (
    <SafeAreaWrapper>
        <Box>
            <Text>Loading...</Text>
        </Box>
    </SafeAreaWrapper>
  )
}

export default Loader
