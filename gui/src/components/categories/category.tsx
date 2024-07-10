
import React from 'react'
import { Box, Text } from '../../utils/theme'
import { ICategory } from '../../types'

type CategoryProps = {
    category: ICategory
}


const Category = ({category}:CategoryProps) => {
  return (
    <Box bg="lightGray" p="4" borderRadius='rounded-5xl'>
    <Box flexDirection='row'>
    <Text variant='textXl' fontWeight='500' mr='3'>
      {category.icon.symbol}</Text>
    <Text variant='textBase' fontWeight="600" >{category.name}</Text>
    </Box>
   
</Box>
  )
}

export default Category