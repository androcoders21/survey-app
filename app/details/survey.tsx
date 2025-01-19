import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Stack } from 'expo-router'
import React from 'react'

const Survey = () => {
    return (
        <Box>
            <Stack.Screen options={{
                title: 'Survey Details',
                headerTitle: "Survey Details",
                headerShown: true,
                headerShadowVisible: false,
            }} />
            <Heading className='text-center pt-2'>Coming Soon</Heading>
        </Box>
    )
}

export default Survey