import { Box } from '@/components/ui/box'
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { useGetUserDetailsMutation, useLoginUserMutation } from '@/redux/api/end-points/user'
import { setUserId, setUserToken } from '@/redux/slices/user'
import { storeToLocal } from '@/utils/helper'
import { useAppDispatch } from '@/utils/hooks'
import { loginSchema, LoginType } from '@/utils/validation-schema'
import { Feather } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { router, Stack } from 'expo-router'
import React from 'react'
import { Controller, set, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, StyleSheet, ToastAndroid } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const EyeOffIcon = () => { return <Feather name="eye-off" size={16} /> }

const EyeIcon = () => { return <Feather name="eye" size={16} /> }

const Signin = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const handleState = () => setShowPassword(!showPassword);
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const [getUserDetails, { isSuccess }] = useGetUserDetailsMutation();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const dispatch = useAppDispatch()
    const { formState: { errors }, control, handleSubmit } = useForm<LoginType>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginType) => {
        // console.log(data) 
        setIsSubmitting(true);
        try {
            const response = await loginUser(data).unwrap();
            console.log(response.access_token); // access token
            storeToLocal('@token', response?.access_token);
            dispatch(setUserToken(response?.access_token));
            const user = await getUserDetails(undefined).unwrap();
            console.log("User Details", user);
            if (user?.id) {
                dispatch(setUserId(user?.id?.toString()));
                storeToLocal('@userId', user?.id?.toString());
            } else {
                ToastAndroid.show("User Id not found", ToastAndroid.SHORT);
            }
            setIsSubmitting(false);
            ToastAndroid.show("Successfully logged in", ToastAndroid.LONG);
            router.replace('/(tabs)')
        } catch (error) {
            console.log(error);
            setIsSubmitting(false);
            ToastAndroid.show("Invalid Credentials", ToastAndroid.SHORT);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Box>
                <Stack.Screen
                    options={{
                        headerShown: false
                    }}
                />
                <Box className="">
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : undefined} >
                        <VStack space="lg">
                    <Heading className='text-center mt-20 py-10' size='3xl'>SDV Survey</Heading>
                            <Heading size="3xl" className="text-primary-500 py-4 text-center">Sign In</Heading>
                            <VStack>
                                <Text size="sm" className="mb-1" bold>Email *</Text>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <Input variant="outline" className="rounded-2xl" size="lg" isDisabled={false} isInvalid={!!errors.email} isReadOnly={false} >
                                            <InputField
                                                className="text-sm font-bold"
                                                onChange={(e) => onChange(e.nativeEvent.text)}
                                                value={value}
                                                placeholder='Enter Email'
                                            />
                                        </Input>
                                    )}
                                />
                                {errors.email && <Text className="pl-2 text-red-500" size="xs">{errors.email?.message}</Text>}
                            </VStack>
                            <VStack>
                                <Text size="sm" className="mb-1" bold>Password *</Text>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <Input variant="outline" className="rounded-2xl" size="lg" isInvalid={!!error} isReadOnly={false} >
                                            <InputField
                                                type={showPassword ? "text" : "password"}
                                                className="text-sm font-bold"
                                                onChange={(e) => onChange(e.nativeEvent.text)}
                                                placeholder='Enter Password'
                                            />
                                            <InputSlot className="pr-3" onPress={handleState}>
                                                <InputIcon
                                                    as={showPassword ? EyeIcon : EyeOffIcon}
                                                    className="text-darkBlue-500"
                                                />
                                            </InputSlot>
                                        </Input>
                                    )}
                                />
                                {errors.password && <Text className="pl-2 text-red-500" size="xs">{errors.password?.message}</Text>}
                            </VStack>

                            <Button isDisabled={isSubmitting} onPress={handleSubmit(onSubmit)} className='h-14 w-80 mt-4 rounded-3xl'>
                                {isSubmitting && <ButtonSpinner size={30} color={'black'} />}<ButtonText className='text-center'>Sign In</ButtonText></Button>
                        </VStack>
                    </KeyboardAvoidingView>
                </Box>
            </Box>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    }
})

export default Signin