import { Input, Button, Layout, Text } from '@ui-kitten/components'
import { Alert, useWindowDimensions } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { MyIcon } from '../../components/ui/MyIcon'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParams } from '../../navigation/StackNavigator'
import { useState } from 'react'
import { useAuthStore } from '../../store/auth/useAuthStore'

interface Props extends StackScreenProps<RootStackParams, "RegisterScreen"> { }

export const RegisterScreen = ({ navigation }: Props) => {

    const { height } = useWindowDimensions()

    const{register} = useAuthStore()

    const [isPosting, setIsPosting] = useState(false)

    const [form, setForm] = useState({
        email: "",
        password:"",
        fullName:""
    })

    const onRegister= async () =>{
        setIsPosting(true);
        if(form.email.length === 0 || form.password.length === 0)
            return;

        const wasSuccesful = await register(form.email, form.password, form.fullName);
        setIsPosting(false);

        if(wasSuccesful) return;

        Alert.alert("Error", "Email ya registrado");
    }

    return (
        <Layout style={{ flex: 1 }}>

            <ScrollView style={{ marginHorizontal: 40 }}>
                <Layout style={{ paddingTop: height * 0.3 }}>
                    <Text category='h1'>Crear cuenta</Text>
                    <Text category='p2'>Por favor, crea una cuenta para continuar</Text>
                </Layout>

                <Layout style={{ marginTop: 20 }}>
                    <Input
                        placeholder='Nombre completo'
                        accessoryLeft={<MyIcon name="person-outline" />}
                        style={{ marginBottom: 10 }}
                        value={form.fullName}
                        onChangeText={(fullName) => setForm({...form, fullName})}
                    />
                    <Input
                        placeholder='Correo electronico'
                        keyboardType='email-address'
                        accessoryLeft={<MyIcon name="email-outline" />}
                        autoCapitalize='none'
                        value={form.email}
                        onChangeText={(email) => setForm({...form, email})}
                        style={{ marginBottom: 10 }}
                    />
                    <Input
                        placeholder='Contraseña'
                        secureTextEntry
                        accessoryLeft={<MyIcon name="lock-outline" />}
                        autoCapitalize='none'
                        style={{ marginBottom: 10 }}
                        value={form.password}
                        onChangeText={(password) => setForm({...form, password})}
                    />
                </Layout>

                <Layout style={{ height: 10 }} />

                <Layout>
                    <Button
                        disabled={isPosting}
                        onPress={() => onRegister()}
                        //appearance='ghost'
                        accessoryRight={<MyIcon name="arrow-forward-outline" white />}
                    >
                        Registrarse
                    </Button>
                </Layout>

                <Layout style={{ height: 50 }} />

                <Layout style={{ alignItems: "flex-end", flexDirection: "row", justifyContent: "center" }}>
                    <Text>¿Ya tienes una cuenta?</Text>
                    <Text
                        status='primary'
                        category='s1'
                        onPress={() => navigation.goBack()}
                    >Iniciar sesion</Text>
                </Layout>

            </ScrollView>

        </Layout>
    )
}